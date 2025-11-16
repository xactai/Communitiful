import React from 'react';

interface AnimatedAvatarProps {
  seed: string;
  size?: number;
  label?: string;
}

const PALETTES: Array<[string, string]> = [
  ['#4f46e5', '#22d3ee'],
  ['#10b981', '#60a5fa'],
  ['#f59e0b', '#ef4444'],
  ['#8b5cf6', '#06b6d4'],
  ['#ec4899', '#f97316'],
  ['#0ea5e9', '#22c55e'],
];

function hashStringToIndex(str: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % modulo;
}

export function AnimatedAvatar({ seed, size = 24, label }: AnimatedAvatarProps) {
  const idx = hashStringToIndex(seed || 'default', PALETTES.length);
  const [c1, c2] = PALETTES[idx];
  const dim = `${size}px`;

  return (
    <div
      aria-label={label || 'Avatar'}
      className="relative rounded-full overflow-hidden"
      style={{ width: dim, height: dim }}
    >
      {/* Spinning gradient ring */}
      <div
        className="absolute inset-0 animate-[spin_8s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, ${c1}, ${c2}, ${c1})`,
        }}
      />
      {/* Inner core */}
      <div className="absolute inset-[2px] rounded-full bg-white/90 flex items-center justify-center">
        <div
          className="rounded-full animate-pulse"
          style={{
            width: Math.max(4, size * 0.18),
            height: Math.max(4, size * 0.18),
            backgroundColor: c1,
            boxShadow: `0 0 10px ${c2}40`,
          }}
        />
      </div>
    </div>
  );
}


