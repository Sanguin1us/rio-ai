import { useState, useEffect, useRef } from 'react';

/**
 * Props for the AnimateOnScroll component.
 */
interface AnimateOnScrollProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Intersection threshold (0-1) for triggering animation */
  threshold?: number;
  /** Tailwind duration class for animation */
  duration?: string;
}

/**
 * A wrapper component that animates its children when scrolled into view.
 * Uses IntersectionObserver for efficient scroll detection.
 *
 * @example
 * ```tsx
 * <AnimateOnScroll delay={200} threshold={0.2}>
 *   <p>This content fades in when scrolled into view</p>
 * </AnimateOnScroll>
 * ```
 */
export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  duration = 'duration-700',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (element) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all ${duration} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
