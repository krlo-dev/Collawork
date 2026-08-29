export function SkillChip({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 bg-surface-container-low text-on-surface-variant text-label-sm rounded border border-outline-variant">
      {label}
    </span>
  );
}
