import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/lib/shopify/types";

export function Price({
  price,
  compareAt,
  locale,
  prefix,
  className = "",
  size = "md",
}: {
  price: Money;
  compareAt?: Money | null;
  locale: Locale;
  prefix?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hasCompare = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl md:text-[1.75rem]" };
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      {prefix && <span className="text-sm text-ink-muted">{prefix}</span>}
      <span className={`${sizes[size]} font-semibold tabular-nums text-green`}>{formatMoney(price, locale)}</span>
      {hasCompare && (
        <s className="text-sm tabular-nums text-ink-muted decoration-ink-muted/60">{formatMoney(compareAt!, locale)}</s>
      )}
    </span>
  );
}
