import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/lib/shopify/types";

const SHOW_COMPARE = process.env.NEXT_PUBLIC_SHOW_COMPARE_PRICES !== "false";

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
  // Strike prices need the lowest price of the last 30 days as reference (PAngV § 11); hide them site-wide if that is not documented
  const hasCompare = SHOW_COMPARE && compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
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
