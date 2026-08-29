export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="10" r="4" fill="currentColor" className="text-primary" />
      <circle cx="34" cy="14" r="3.2" fill="currentColor" className="text-on-surface-variant" />
      <path
        d="M16 16 L8 34 M16 16 L24 34 M16 16 L16 34"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 19 L28 34 L40 34"
        stroke="currentColor"
        className="text-on-surface-variant"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
