import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, CatmullRomCurve3, Quaternion, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

const EARTH_RADIUS = 2;
const CAMERA_RADIUS = 6.0;
const LINE_RADIUS = EARTH_RADIUS + 0.02;
const FLY_DURATION = 1.6;
const DRAW_DURATION = 4.8;
const HOLD_DURATION = 1.2;
const Y_AXIS = new Vector3(0, 1, 0);
const ARROW_HEAD_RADIUS = 0.05;
const ARROW_HEAD_LENGTH = 0.16;
const ARROW_BASE_AXIS = new Vector3(0, 1, 0);

type RoutePoint = {
    lat: number;
    lon: number;
    label: string;
};

type Route = {
    id: string;
    start: RoutePoint;
    end: RoutePoint;
    curve: CatmullRomCurve3;
};

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new Vector3(x, y, z);
};

const createRouteCurve = (start: RoutePoint, end: RoutePoint, segments = 180) => {
    const startVec = latLonToVector3(start.lat, start.lon, 1);
    const endVec = latLonToVector3(end.lat, end.lon, 1);
    const points = [];
    for (let i = 0; i <= segments; i += 1) {
        const t = i / segments;
        const vec = new Vector3().copy(startVec).lerp(endVec, t).normalize();
        points.push(vec);
    }
    return new CatmullRomCurve3(points);
};

const ROUTES: Route[] = [
    {
        id: 'rio-istanbul',
        start: { lat: -22.9068, lon: -43.1729, label: 'Rio de Janeiro' },
        end: { lat: 41.0082, lon: 28.9784, label: 'Istanbul' },
        curve: createRouteCurve(
            { lat: -22.9068, lon: -43.1729, label: 'Rio de Janeiro' },
            { lat: 41.0082, lon: 28.9784, label: 'Istanbul' }
        )
    },
    {
        id: 'new-york-tokyo',
        start: { lat: 40.7128, lon: -74.0060, label: 'Nova York' },
        end: { lat: 35.6762, lon: 139.6503, label: 'Tóquio' },
        curve: createRouteCurve(
            { lat: 40.7128, lon: -74.0060, label: 'Nova York' },
            { lat: 35.6762, lon: 139.6503, label: 'Tóquio' }
        )
    },
    {
        id: 'sydney-new-delhi',
        start: { lat: -33.8688, lon: 151.2093, label: 'Sydney' },
        end: { lat: 28.6139, lon: 77.2090, label: 'Nova Délhi' },
        curve: createRouteCurve(
            { lat: -33.8688, lon: 151.2093, label: 'Sydney' },
            { lat: 28.6139, lon: 77.2090, label: 'Nova Délhi' }
        )
    }
];

const AnimatedRouteLine = ({ route, progress }: { route: Route; progress: number }) => {
    const linePoints = useMemo(() => {
        if (progress <= 0) return [];
        const totalLength = route.curve.getLength() * LINE_RADIUS;
        const headGap = ARROW_HEAD_LENGTH * 0.9;
        const adjustedProgress = totalLength > 0
            ? Math.max(0, progress - (headGap / totalLength))
            : progress;
        if (adjustedProgress <= 0) return [];
        const segments = 140;
        const steps = Math.max(1, Math.floor(adjustedProgress * segments));
        const points = [];
        // Draw only the traveled portion of the route.
        for (let i = 0; i <= steps; i += 1) {
            const t = (i / steps) * adjustedProgress;
            points.push(route.curve.getPoint(t).clone().multiplyScalar(LINE_RADIUS));
        }
        return points;
    }, [progress, route]);

    const lineCurve = useMemo(() => {
        if (linePoints.length < 2) return null;
        return new CatmullRomCurve3(linePoints);
    }, [linePoints]);

    if (!lineCurve) return null;

    return (
        <mesh>
            <tubeGeometry args={[lineCurve, 64, 0.012, 8, false]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} />
        </mesh>
    );
};

const RouteCameraRig = ({
    activeRoute,
    focusActive,
    onRouteAdvance,
    rotationRef,
    setDrawProgress
}: {
    activeRoute: Route;
    focusActive: boolean;
    onRouteAdvance: () => void;
    rotationRef: React.MutableRefObject<number>;
    setDrawProgress: (value: number) => void;
}) => {
    const { camera } = useThree();
    const phaseRef = useRef<'fly' | 'draw' | 'hold'>('fly');
    const phaseTimeRef = useRef(0);
    const fromPositionRef = useRef(new Vector3());

    useEffect(() => {
        if (!focusActive) return;
        phaseRef.current = 'fly';
        phaseTimeRef.current = 0;
        setDrawProgress(0);
        fromPositionRef.current.copy(camera.position);
    }, [activeRoute.id, camera, focusActive, setDrawProgress]);

    useFrame((_, delta) => {
        if (!focusActive) return;

        // Keep camera motion aligned with the Earth's current rotation.
        const rotation = rotationRef.current;
        const startPosition = activeRoute.curve.getPoint(0).clone().multiplyScalar(CAMERA_RADIUS).applyAxisAngle(Y_AXIS, rotation);
        const endPosition = activeRoute.curve.getPoint(1).clone().multiplyScalar(CAMERA_RADIUS).applyAxisAngle(Y_AXIS, rotation);

        phaseTimeRef.current += delta;

        if (phaseRef.current === 'fly') {
            const t = Math.min(phaseTimeRef.current / FLY_DURATION, 1);
            const eased = t * t * (3 - 2 * t);
            camera.position.lerpVectors(fromPositionRef.current, startPosition, eased);
            camera.lookAt(0, 0, 0);
            if (t >= 1) {
                phaseRef.current = 'draw';
                phaseTimeRef.current = 0;
            }
            return;
        }

        if (phaseRef.current === 'draw') {
            const t = Math.min(phaseTimeRef.current / DRAW_DURATION, 1);
            setDrawProgress(t);
            const headPosition = activeRoute.curve.getPoint(t).clone().multiplyScalar(CAMERA_RADIUS).applyAxisAngle(Y_AXIS, rotation);
            camera.position.copy(headPosition);
            camera.lookAt(0, 0, 0);
            if (t >= 1) {
                phaseRef.current = 'hold';
                phaseTimeRef.current = 0;
            }
            return;
        }

        if (phaseRef.current === 'hold') {
            camera.position.copy(endPosition);
            camera.lookAt(0, 0, 0);
            if (phaseTimeRef.current >= HOLD_DURATION) {
                phaseRef.current = 'fly';
                phaseTimeRef.current = 0;
                setDrawProgress(0);
                onRouteAdvance();
                fromPositionRef.current.copy(camera.position);
            }
        }
    });

    return null;
};

const Earth = ({
    activeRoute,
    drawProgress,
    focusActive,
    rotationRef
}: {
    activeRoute: Route;
    drawProgress: number;
    focusActive: boolean;
    rotationRef: React.MutableRefObject<number>;
}) => {
    const earthGroupRef = useRef<any>();
    const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    ]);

    useFrame(() => {
        if (!earthGroupRef.current) return;
        if (!focusActive) {
            rotationRef.current += 0.0005;
        }
        // Track rotation so camera math stays consistent once animation starts.
        earthGroupRef.current.rotation.y = rotationRef.current;
    });

    const headPosition = useMemo(() => {
        if (!focusActive || drawProgress <= 0) return null;
        return activeRoute.curve.getPoint(drawProgress).clone().multiplyScalar(LINE_RADIUS);
    }, [activeRoute, drawProgress, focusActive]);

    const headTangent = useMemo(() => {
        if (!focusActive || drawProgress <= 0) return null;
        return activeRoute.curve.getTangent(drawProgress).clone().normalize();
    }, [activeRoute, drawProgress, focusActive]);

    const headQuaternion = useMemo(() => {
        if (!headTangent) return null;
        return new Quaternion().setFromUnitVectors(ARROW_BASE_AXIS, headTangent);
    }, [headTangent]);

    const headPositionAdjusted = useMemo(() => {
        if (!headPosition || !headTangent) return null;
        return headPosition.clone().addScaledVector(headTangent, -ARROW_HEAD_LENGTH / 2);
    }, [headPosition, headTangent]);

    return (
        <group ref={earthGroupRef}>
            <mesh>
                <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    shininess={10}
                />
            </mesh>
            {focusActive && <AnimatedRouteLine route={activeRoute} progress={drawProgress} />}
            {headPositionAdjusted && headQuaternion && (
                <mesh position={[headPositionAdjusted.x, headPositionAdjusted.y, headPositionAdjusted.z]} quaternion={headQuaternion}>
                    <coneGeometry args={[ARROW_HEAD_RADIUS, ARROW_HEAD_LENGTH, 16]} />
                    <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
}

const SpinningEarth = () => {
    const [focusActive, setFocusActive] = useState(false);
    const [routeIndex, setRouteIndex] = useState(0);
    const [drawProgress, setDrawProgress] = useState(0);
    const earthRotationRef = useRef(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handler = () => setFocusActive(true);
        window.addEventListener('tta-typewriter-complete', handler);
        return () => window.removeEventListener('tta-typewriter-complete', handler);
    }, []);

    const activeRoute = useMemo(() => ROUTES[routeIndex], [routeIndex]);

    const routeLabel = focusActive
        ? `${activeRoute.start.label} e ${activeRoute.end.label}`
        : '';

    return (
        <div className={`w-full h-[560px] md:h-[640px] relative ${focusActive ? '' : 'cursor-grab active:cursor-grabbing'}`}>
            <Canvas camera={{ position: [0, 0, 6.0], fov: 45 }}>
                <ambientLight intensity={3.5} />
                <pointLight position={[10, 10, 10]} intensity={2.0} />
                <pointLight position={[-10, -10, -10]} intensity={1.0} color="#bad7ff" />
                <Earth
                    activeRoute={activeRoute}
                    drawProgress={drawProgress}
                    focusActive={focusActive}
                    rotationRef={earthRotationRef}
                />
                {focusActive && (
                    <RouteCameraRig
                        activeRoute={activeRoute}
                        focusActive={focusActive}
                        onRouteAdvance={() => setRouteIndex((prev) => (prev + 1) % ROUTES.length)}
                        rotationRef={earthRotationRef}
                        setDrawProgress={setDrawProgress}
                    />
                )}
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={!focusActive} minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3} />
            </Canvas>
            <div
                className={`pointer-events-none absolute inset-x-0 bottom-6 flex justify-center transition-opacity duration-700 ${focusActive ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="rounded-full bg-white/90 px-5 py-2.5 text-sm md:text-base font-semibold text-slate-700 shadow-sm backdrop-blur">
                    {routeLabel}
                </div>
            </div>
        </div>
    );
};

export default SpinningEarth;
