import { useEffect, useState, useMemo } from 'react';

// Predefined shatter patterns (clip-paths) that sum up to a whole square (roughly)
// These are normalized 0-100% coordinates.
const SHATTER_PATTERNS = [
  // Pattern 1: Diagonal Cross
  [
    'polygon(0% 0%, 50% 50%, 0% 100%)', // Left
    'polygon(0% 0%, 100% 0%, 50% 50%)', // Top
    'polygon(100% 0%, 100% 100%, 50% 50%)', // Right
    'polygon(0% 100%, 100% 100%, 50% 50%)', // Bottom
  ],
  // Pattern 2: Shattered Glass (Asymmetric)
  [
    'polygon(0% 0%, 60% 0%, 40% 40%, 0% 50%)', // Top-Left
    'polygon(60% 0%, 100% 0%, 100% 60%, 40% 40%)', // Top-Right
    'polygon(100% 60%, 100% 100%, 30% 100%, 40% 40%)', // Bottom-Right
    'polygon(0% 50%, 40% 40%, 30% 100%, 0% 100%)', // Bottom-Left
  ],
  // Pattern 3: Vertical Slices with angle
  [
    'polygon(0% 0%, 30% 0%, 40% 100%, 0% 100%)',
    'polygon(30% 0%, 70% 0%, 80% 100%, 40% 100%)',
    'polygon(70% 0%, 100% 0%, 100% 100%, 80% 100%)',
  ],
  // Pattern 4: Horizontal Slices with angle
  [
    'polygon(0% 0%, 100% 0%, 100% 30%, 0% 40%)',
    'polygon(0% 40%, 100% 30%, 100% 70%, 0% 60%)',
    'polygon(0% 60%, 100% 70%, 100% 100%, 0% 100%)',
  ],
];

const LETTER_ANIMATION_DELAY = 50; // ms between letters

const Letter: React.FC<{ char: string; index: number; startAnimation: boolean }> = ({
  char,
  index,
  startAnimation,
}) => {
  // Generate shards for this letter once
  const shards = useMemo(() => {
    if (char === ' ') return []; // No shards for space

    // Pick a random pattern
    const patternIndex = Math.floor(Math.random() * SHATTER_PATTERNS.length);
    const pattern = SHATTER_PATTERNS[patternIndex];
    if (!pattern) return [];

    return pattern.map((clipPath, i) => {
      // Random fly-in values
      // We want them to come from "outside" the center.
      // A simple heuristic: if the shard is "top-ish", fly from top.

      const angle = Math.random() * 360;
      const distance = 100 + Math.random() * 100; // px

      const x = Math.cos(angle * (Math.PI / 180)) * distance;
      const y = Math.sin(angle * (Math.PI / 180)) * distance;

      return {
        clipPath,
        x,
        y,
        r: (Math.random() - 0.5) * 40, // Slight rotation
        scale: 0.5 + Math.random() * 0.5, // Start smaller
        delay: i * 50 + Math.random() * 50, // Internal stagger
      };
    });
  }, [char]);

  if (char === ' ') return <span className="inline-block w-4">&nbsp;</span>;

  return (
    <span className="relative inline-block" style={{ width: 'auto' }}>
      {/* Placeholder to reserve space */}
      <span className="invisible">{char}</span>

      {/* Shards */}
      {shards.map((shard, i) => (
        <span
          key={i}
          className="absolute inset-0 text-rio-primary drop-shadow-[0_15px_35px_rgba(0,43,127,0.15)]"
          style={{
            clipPath: shard.clipPath,
            transform: startAnimation
              ? 'translate(0,0) rotate(0) scale(1)'
              : `translate(${shard.x}px, ${shard.y}px) rotate(${shard.r}deg) scale(${shard.scale})`,
            opacity: startAnimation ? 1 : 0,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
            transitionDelay: `${index * LETTER_ANIMATION_DELAY + shard.delay}ms`,
            willChange: 'transform, opacity',
          }}
        >
          {char}
        </span>
      ))}

      {/* Solid letter fade in to fix any hairline gaps */}
      <span
        className="absolute inset-0 text-rio-primary drop-shadow-[0_15px_35px_rgba(0,43,127,0.15)]"
        style={{
          opacity: startAnimation ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
          transitionDelay: `${index * LETTER_ANIMATION_DELAY + 800}ms`,
        }}
      >
        {char}
      </span>
    </span>
  );
};

export const HeroTitleAnimation: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [start, setStart] = useState(false);
  const text = 'Rio 2.5';
  const chars = text.split('');

  useEffect(() => {
    const timer = setTimeout(() => setStart(true), 200);

    // Calculate total animation time:
    // 200ms (start delay) +
    // (chars.length - 1) * 50ms (last letter start) +
    // ~100ms (last shard delay) +
    // 1200ms (transform duration)
    // ~ 200 + 300 + 100 + 1200 = 1800ms
    // Let's trigger complete a bit earlier or exactly when done.
    // Let's say 2000ms to be safe and allow for the solid fade to start.
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <h1
      className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl flex flex-wrap justify-center gap-[0.05em]"
      aria-label="Rio 2.5"
    >
      {chars.map((c, i) => (
        <Letter key={i} char={c} index={i} startAnimation={start} />
      ))}
    </h1>
  );
};
