import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CatmullRomCurve3, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

const Earth = () => {
    const earthRef = useRef<any>();
    const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    ]);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005;
        }
    });

    const radius = 2;

    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new Vector3(x, y, z);
    }

    const DistanceLine = ({ startLat, startLon, endLat, endLon, color = "#3b82f6" }: { startLat: number, startLon: number, endLat: number, endLon: number, color?: string }) => {
        const curvePoints = useMemo(() => {
            const start = latLonToVector3(startLat, startLon, radius);
            const end = latLonToVector3(endLat, endLon, radius);
            const points = [];
            const segments = 60;
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const vec = new Vector3().copy(start).lerp(end, t).normalize().multiplyScalar(radius + 0.02);
                points.push(vec);
            }
            return new CatmullRomCurve3(points);
        }, [startLat, startLon, endLat, endLon]);

        return (
            <group>
                <mesh>
                    <tubeGeometry args={[curvePoints, 64, 0.012, 8, false]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                <mesh position={[curvePoints.points[0].x, curvePoints.points[0].y, curvePoints.points[0].z]}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[
                    curvePoints.points[curvePoints.points.length - 1].x,
                    curvePoints.points[curvePoints.points.length - 1].y,
                    curvePoints.points[curvePoints.points.length - 1].z
                ]}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </group>
        );
    };

    return (
        <group rotation={[0, 0, 0]}>
            <mesh ref={earthRef}>
                <sphereGeometry args={[radius, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    shininess={10}
                />

                {/* Rio de Janeiro -> Istanbul (~10,265 km) */}
                <DistanceLine
                    startLat={-22.9068}
                    startLon={-43.1729}
                    endLat={41.0082}
                    endLon={28.9784}
                />

                {/* New York -> Tokyo (~10,850 km) */}
                <DistanceLine
                    startLat={40.7128}
                    startLon={-74.0060}
                    endLat={35.6762}
                    endLon={139.6503}
                />

                {/* Sydney -> New Delhi (~10,400 km) */}
                <DistanceLine
                    startLat={-33.8688}
                    startLon={151.2093}
                    endLat={28.6139}
                    endLon={77.2090}
                />
            </mesh>
        </group>
    );
}

const SpinningEarth = () => {
    return (
        <div className="w-full h-[500px] relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6.0], fov: 45 }}>
                <ambientLight intensity={3.5} />
                <pointLight position={[10, 10, 10]} intensity={2.0} />
                <pointLight position={[-10, -10, -10]} intensity={1.0} color="#bad7ff" />
                <Earth />
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3} />
            </Canvas>
        </div>
    );
};

export default SpinningEarth;
