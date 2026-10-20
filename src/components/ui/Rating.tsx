import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Rating({
  value,
  count,
  dict,
  compact = false,
}: {
  value: number | null;
  count: number;
  dict: Dictionary;
  compact?: boolean;
}) {
  if (!value || count <= 0) return null;
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const label = `${value.toLocaleString("de-DE", { maximumFractionDigits: 1 })} / 5, ${count} ${count === 1 ? dict.product.review : dict.product.reviews}`;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted" aria-label={label} title={label}>
      {!compact && <span className="font-semibold text-ink tabular-nums">{value.toLocaleString("de-DE", { maximumFractionDigits: 1 })}</span>}
      <span className="stars" style={{ ["--pct" as string]: `${pct}%` }} aria-hidden />
      <span className="tabular-nums">
        {count} {compact ? "" : count === 1 ? dict.product.review : dict.product.reviews}
      </span>
    </span>
  );
}
