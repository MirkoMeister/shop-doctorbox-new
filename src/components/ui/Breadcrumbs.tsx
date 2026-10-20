import Link from "next/link";
import { ChevronRight } from "./Icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-ink-muted ${className}`}>
      <ol className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className={`flex min-w-0 items-center gap-1 ${i < items.length - 1 ? "shrink-0" : "min-w-0"}`}>
            {i > 0 && <ChevronRight width={14} height={14} className="opacity-60" />}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
