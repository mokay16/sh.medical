/** A stethoscope illustration in the site's palette, for the 3D call-to-action card. Decorative. */
export function Stethoscope({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 250" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="steth-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f6f7" />
          <stop offset="0.45" stopColor="#b9c3c8" />
          <stop offset="0.7" stopColor="#e6eaec" />
          <stop offset="1" stopColor="#8e9ba2" />
        </linearGradient>
        <radialGradient id="steth-diaphragm" cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#dfe6e8" />
          <stop offset="1" stopColor="#aab6bc" />
        </radialGradient>
        <linearGradient id="steth-tube" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a4b59" />
          <stop offset="0.5" stopColor="#27343f" />
          <stop offset="1" stopColor="#1c262e" />
        </linearGradient>
      </defs>

      {/* tubing: from the Y-joint down, looping to the chest piece */}
      <path d="M100 124 C100 172 64 182 70 212 C76 240 138 244 160 220 C170 209 172 200 170 192" fill="none" stroke="url(#steth-tube)" strokeWidth="10" strokeLinecap="round" />
      <path d="M98 128 C97 172 61 183 67 211 C73 236 132 240 155 220" fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="2.5" strokeLinecap="round" />

      {/* metal ear tubes */}
      <path d="M68 26 C62 64 76 100 100 124" fill="none" stroke="url(#steth-metal)" strokeWidth="7" strokeLinecap="round" />
      <path d="M132 26 C138 64 124 100 100 124" fill="none" stroke="url(#steth-metal)" strokeWidth="7" strokeLinecap="round" />
      {/* tension spring */}
      <path d="M76 78 Q100 70 124 78" fill="none" stroke="url(#steth-metal)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Y-joint */}
      <circle cx="100" cy="124" r="7" fill="url(#steth-metal)" />

      {/* ear tips */}
      <ellipse cx="68" cy="20" rx="8" ry="10" fill="#27343f" />
      <ellipse cx="132" cy="20" rx="8" ry="10" fill="#27343f" />
      <ellipse cx="65.5" cy="16" rx="2.5" ry="3.5" fill="rgb(255 255 255 / 0.35)" />
      <ellipse cx="129.5" cy="16" rx="2.5" ry="3.5" fill="rgb(255 255 255 / 0.35)" />

      {/* chest piece */}
      <path d="M170 192 L178 182" stroke="url(#steth-metal)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="192" cy="168" r="28" fill="url(#steth-metal)" />
      <circle cx="192" cy="168" r="22" fill="none" stroke="#9e4a2e" strokeWidth="3.5" />
      <circle cx="192" cy="168" r="18" fill="url(#steth-diaphragm)" />
      <ellipse cx="184" cy="159" rx="7" ry="4" fill="rgb(255 255 255 / 0.7)" transform="rotate(-30 184 159)" />
    </svg>
  )
}
