export function DanangIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Minh họa Đà Nẵng">
      <defs>
        <linearGradient id="dn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE9C8" />
          <stop offset="100%" stopColor="#FBC7A3" />
        </linearGradient>
        <linearGradient id="dn-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2FA6A0" />
          <stop offset="100%" stopColor="#1B7A82" />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill="url(#dn-sky)" />
      <circle cx="320" cy="60" r="34" fill="#F6A45C" opacity="0.9" />

      {/* Mountain range (Ngũ Hành Sơn) */}
      <path d="M0,150 L60,90 L100,140 L150,70 L210,150 L260,110 L320,150 L400,120 L400,180 L0,180 Z" fill="#3D6E8C" opacity="0.55" />
      <path d="M0,170 L80,120 L140,160 L200,110 L260,165 L340,130 L400,160 L400,190 L0,190 Z" fill="#2C5470" opacity="0.75" />

      {/* Sea */}
      <rect x="0" y="182" width="400" height="78" fill="url(#dn-sea)" />
      <path d="M0,190 Q50,182 100,190 T200,190 T300,190 T400,190 L400,200 Q350,192 300,200 T200,200 T100,200 T0,200 Z" fill="#ffffff" opacity="0.25" />
      <path d="M0,210 Q50,202 100,210 T200,210 T300,210 T400,210 L400,220 Q350,212 300,220 T200,220 T100,220 T0,220 Z" fill="#ffffff" opacity="0.18" />

      {/* Small boat */}
      <path d="M250,205 L285,205 L278,215 L257,215 Z" fill="#F7E7D2" />
      <line x1="267" y1="205" x2="267" y2="192" stroke="#F7E7D2" strokeWidth="2" />
      <path d="M267,193 L280,203 L267,203 Z" fill="#F7E7D2" />

      {/* Palm silhouette */}
      <g transform="translate(40,205)">
        <path d="M0,45 L0,15" stroke="#1E4A3D" strokeWidth="4" strokeLinecap="round" />
        <path d="M0,15 C-18,5 -28,10 -34,2" stroke="#1E4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M0,15 C15,2 26,6 33,-2" stroke="#1E4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M0,15 C-10,0 -8,-10 -14,-16" stroke="#1E4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M0,15 C8,-2 8,-12 14,-18" stroke="#1E4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M0,15 C0,0 0,-10 0,-20" stroke="#1E4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HoiAnIllustration({ className }: { className?: string }) {
  const lanternColors = ["#F2545B", "#F6A45C", "#F2C14E", "#E96A6A", "#F08A4B"];

  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Minh họa Hội An">
      <defs>
        <linearGradient id="ha-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B2350" />
          <stop offset="100%" stopColor="#5A3B63" />
        </linearGradient>
        <linearGradient id="ha-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A2E5C" />
          <stop offset="100%" stopColor="#241C3D" />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill="url(#ha-sky)" />
      <circle cx="70" cy="55" r="26" fill="#F6E7B0" opacity="0.9" />

      {/* Ancient town rooftops */}
      <path
        d="M0,150 L30,120 L60,150 L90,110 L120,150 L150,125 L180,150 L210,115 L240,150 L270,128 L300,150 L330,118 L360,150 L400,130 L400,175 L0,175 Z"
        fill="#3B2A2A"
        opacity="0.9"
      />
      <g opacity="0.8">
        {[30, 90, 150, 210, 270, 330].map((x) => (
          <rect key={x} x={x - 8} y="145" width="16" height="22" fill="#4A3535" />
        ))}
      </g>

      {/* Lantern string */}
      <path d="M0,55 Q200,10 400,55" stroke="#7A5C3E" strokeWidth="2" fill="none" opacity="0.6" />
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const x = 10 + t * 380;
        const y = 55 - Math.sin(t * Math.PI) * 45 + 6;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <line x1="0" y1="-6" x2="0" y2="0" stroke="#7A5C3E" strokeWidth="1.5" />
            <ellipse cx="0" cy="8" rx="7" ry="9" fill={lanternColors[i % lanternColors.length]} />
            <rect x="-2.5" y="-1" width="5" height="2" fill="#3B2A2A" />
          </g>
        );
      })}

      {/* River */}
      <rect x="0" y="176" width="400" height="84" fill="url(#ha-river)" />
      {[...lanternColors, ...lanternColors].map((c, i) => (
        <ellipse key={i} cx={20 + i * 40} cy={196 + (i % 2) * 6} rx="6" ry="4" fill={c} opacity="0.55" />
      ))}
      <path d="M0,230 Q50,222 100,230 T200,230 T300,230 T400,230 L400,240 Q350,232 300,240 T200,240 T100,240 T0,240 Z" fill="#ffffff" opacity="0.08" />

      {/* Boat with lantern */}
      <path d="M150,225 L210,225 L200,238 L160,238 Z" fill="#2A1F1F" />
      <line x1="180" y1="225" x2="180" y2="205" stroke="#7A5C3E" strokeWidth="2" />
      <ellipse cx="180" cy="200" rx="6" ry="7" fill="#F2C14E" />
    </svg>
  );
}
