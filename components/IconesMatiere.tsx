export function IconeMaths({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M6 40h36M6 40V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 34c4-14 10-20 14-20s6 8 6 8 4-6 8-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconePC({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="3.5" fill="currentColor"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="currentColor" strokeWidth="2" transform="rotate(60 24 24)"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="currentColor" strokeWidth="2" transform="rotate(120 24 24)"/>
    </svg>
  );
}

export function IconeSVT({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M14 6c0 12 20 12 20 24s-20 12-20 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M34 6c0 12-20 12-20 24s20 12 20 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 14h18M14 24h20M15 34h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
