import { useId } from 'react';

export function Sparkle({ size = 16, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 1.5c.55 5.9 4.6 9.95 10.5 10.5-5.9.55-9.95 4.6-10.5 10.5C11.45 16.6 7.4 12.55 1.5 12 7.4 11.45 11.45 7.4 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Heart({ size = 14, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20.4S3.3 14.9 3.3 8.9A4.8 4.8 0 0 1 12 5.8a4.8 4.8 0 0 1 8.7 3.1c0 6-8.7 11.5-8.7 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDown({ size = 14, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 3v18M5 14l7 7 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PinIcon({ size = 18, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21.5s7-6.2 7-12A7 7 0 1 0 5 9.5c0 5.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function Sprig({ className = '' }) {
  const leaves = [
    { x: 36, y: 46, rotate: -42, scale: 1 },
    { x: 52, y: 38, rotate: -34, scale: 0.92 },
    { x: 68, y: 30, rotate: -26, scale: 0.85 },
    { x: 84, y: 24, rotate: -18, scale: 0.78 },
    { x: 45, y: 49, rotate: 42, scale: 0.9 },
    { x: 62, y: 41, rotate: 34, scale: 0.82 },
    { x: 79, y: 34, rotate: 26, scale: 0.74 },
    { x: 96, y: 27, rotate: 18, scale: 0.66 },
  ];
  return (
    <svg className={className} viewBox="0 0 160 70" fill="none" aria-hidden="true">
      <path
        d="M6 62C52 59 100 38 154 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {leaves.map((leaf) => (
        <ellipse
          key={`${leaf.x}-${leaf.y}`}
          cx={leaf.x}
          cy={leaf.y}
          rx={10 * leaf.scale}
          ry={4.4 * leaf.scale}
          fill="currentColor"
          opacity="0.34"
          transform={`rotate(${leaf.rotate} ${leaf.x} ${leaf.y})`}
        />
      ))}
    </svg>
  );
}

export function Balloons({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 260 400" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="balloon-rose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2d8d2" />
          <stop offset="1" stopColor="#d29a91" />
        </linearGradient>
        <linearGradient id="balloon-sage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfe6d5" />
          <stop offset="1" stopColor="#aebfa0" />
        </linearGradient>
        <linearGradient id="balloon-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0dfc3" />
          <stop offset="1" stopColor="#cba876" />
        </linearGradient>
      </defs>

      <g className="balloon balloon--one">
        <ellipse cx="76" cy="92" rx="50" ry="61" fill="url(#balloon-rose)" />
        <path d="M76 151l-5 9h10z" fill="#c9948c" />
        <path d="M76 160c12 44-14 74 0 122" stroke="#c4ae9d" strokeWidth="1.2" />
        <ellipse cx="58" cy="69" rx="11" ry="17" fill="#fffaf3" opacity=".28" />
      </g>

      <g className="balloon balloon--two">
        <ellipse cx="176" cy="127" rx="43" ry="53" fill="url(#balloon-sage)" />
        <path d="M176 178l-4 8h8z" fill="#9cab8e" />
        <path d="M176 186c-10 44 14 78-2 124" stroke="#c4ae9d" strokeWidth="1.2" />
        <ellipse cx="161" cy="107" rx="9" ry="14" fill="#fffaf3" opacity=".3" />
      </g>

      <g className="balloon balloon--three">
        <ellipse cx="133" cy="222" rx="34" ry="43" fill="url(#balloon-gold)" />
        <path d="M133 263l-3.5 7h7z" fill="#ba9765" />
        <path d="M133 270c9 34-10 62 2 92" stroke="#c4ae9d" strokeWidth="1.2" />
        <ellipse cx="122" cy="206" rx="7" ry="11" fill="#fffaf3" opacity=".32" />
      </g>
    </svg>
  );
}

export function Sticker({ className = '', top = '1', bottom = 'год' }) {
  const rawId = useId();
  const pathId = `sticker-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={className}>
      <svg viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="68" fill="#fffaf3" />
        <circle cx="70" cy="70" r="62" stroke="#c9a978" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="70" cy="70" r="44" stroke="#e3bdb5" strokeWidth="1" opacity=".8" />
        <defs>
          <path
            id={pathId}
            d="M70,70 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0"
          />
        </defs>
        <g className="sticker__ring">
          <text fill="#8a6f60" fontSize="8.2" letterSpacing="2.4" fontFamily="Montserrat, sans-serif">
            <textPath href={`#${pathId}`} startOffset="0">
              номина · один год · 06.12.2026 ·
            </textPath>
          </text>
        </g>
        <text
          x="70"
          y="75"
          textAnchor="middle"
          fill="#b28a52"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="42"
          fontStyle="italic"
        >
          {top}
        </text>
        <text
          x="70"
          y="93"
          textAnchor="middle"
          fill="#a4695f"
          fontFamily="Marck Script, cursive"
          fontSize="15"
        >
          {bottom}
        </text>
      </svg>
    </div>
  );
}

export function GlassIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 5h8l-1.2 8.5a2.8 2.8 0 0 1-5.6 0L6 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 16v10M7 26h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M18 7h8l-1.2 8.5a2.8 2.8 0 0 1-5.6 0L18 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M22 18v8M19 26h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 4.5c1.4 1.2 2.6 1.2 4 0M24 6.5c1.4 1.2 2.6 1.2 4 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4c.7 7.8 4.2 11.3 12 12-7.8.7-11.3 4.2-12 12-.7-7.8-4.2-11.3-12-12 7.8-.7 11.3-4.2 12-12Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="7" r="1.4" fill="currentColor" />
      <circle cx="7" cy="25" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function CakeIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 20h20v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 23.5c2.5 2 4.5 2 7 0s4.5-2 7 0 4.5 2 6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 20v-4.5a2.5 2.5 0 0 1 5 0V20M18 20v-4.5a2.5 2.5 0 0 1 5 0V20" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11.5 10V7M20.5 10V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11.5 4.8c1.3-1.2 1.3-2.4 0-3.6M20.5 4.8c1.3-1.2 1.3-2.4 0-3.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function ProgramIcon({ name, size = 26 }) {
  if (name === 'cake') return <CakeIcon size={size} />;
  if (name === 'star') return <StarIcon size={size} />;
  return <GlassIcon size={size} />;
}

export function CheckIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6.5 17.5 13 24 26 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
