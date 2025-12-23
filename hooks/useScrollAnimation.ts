import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
    /** Threshold for visibility (0-1) */
    threshold?: number;
    /** Root margin for early/late triggering */
    rootMargin?: string;
    /** Whether to only trigger once */
    triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
    /** Ref to attach to the target element */
    ref: RefObject<T | null>;
    /** Whether the element is currently intersecting */
    isIntersecting: boolean;
    /** Whether the element has ever been visible (for triggerOnce) */
    hasBeenVisible: boolean;
}

/**
 * Custom hook for observing element intersection with viewport.
 * Useful for scroll-triggered animations, lazy loading, etc.
 *
 * @param options - Configuration options
 * @returns Object with ref and visibility state
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 * return (
 *   <div ref={ref} className={isIntersecting ? 'visible' : 'hidden'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
    options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

    const ref = useRef<T | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;

                const visible = entry.isIntersecting;
                setIsIntersecting(visible);

                if (visible && !hasBeenVisible) {
                    setHasBeenVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, hasBeenVisible]);

    return { ref, isIntersecting, hasBeenVisible };
}

interface UseScrollAnimationOptions extends UseIntersectionObserverOptions {
    /** Delay before animation starts (ms) */
    delay?: number;
}

interface UseScrollAnimationReturn<T extends HTMLElement> {
    /** Ref to attach to the target element */
    ref: RefObject<T | null>;
    /** Whether the element should be visible (considering delay) */
    isVisible: boolean;
    /** Style object with transition delay */
    style: { transitionDelay: string };
}

/**
 * Custom hook for scroll-triggered animations with delay support.
 * A higher-level abstraction over useIntersectionObserver.
 *
 * @param options - Configuration options
 * @returns Object with ref, visibility state, and style
 *
 * @example
 * ```tsx
 * const { ref, isVisible, style } = useScrollAnimation({ delay: 200 });
 * return (
 *   <div
 *     ref={ref}
 *     className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
 *     style={style}
 *   >
 *     Animated content
 *   </div>
 * );
 * ```
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn<T> {
    const { delay = 0, ...observerOptions } = options;

    const { ref, hasBeenVisible } = useIntersectionObserver<T>({
        ...observerOptions,
        triggerOnce: true,
    });

    return {
        ref,
        isVisible: hasBeenVisible,
        style: { transitionDelay: `${delay}ms` },
    };
}
