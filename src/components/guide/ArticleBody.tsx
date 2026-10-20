import Image from "next/image";
import type { Block } from "@/lib/content/article-render";
import { CheckIcon } from "@/components/ui/Icons";

/** Renders extracted article blocks in the shop's own typography. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            if (b.level === 2)
              return (
                <h2 key={i} id={b.id} className="scroll-mt-28 border-t border-line pt-8 text-[clamp(1.5rem,1.3rem+0.8vw,1.875rem)] font-semibold leading-tight tracking-[-0.02em] text-moss [&:not(:first-child)]:mt-14">
                  {b.text}
                </h2>
              );
            if (b.level === 3)
              return (
                <h3 key={i} className="mt-10 text-xl font-semibold leading-snug text-moss">
                  {b.text}
                </h3>
              );
            return (
              <h4 key={i} className="mt-8 text-lg font-semibold">
                {b.text}
              </h4>
            );
          }
          case "paragraph":
            return <p key={i} className="article-inline mt-5 text-[1.125rem] leading-[1.7]" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={`article-inline mt-5 space-y-2 pl-1 text-[1.125rem] leading-[1.65] ${b.ordered ? "list-decimal pl-6 marker:font-semibold marker:text-green" : ""}`}>
                {b.items.map((it, k) =>
                  b.ordered ? (
                    <li key={k} className="pl-1" dangerouslySetInnerHTML={{ __html: it }} />
                  ) : (
                    <li key={k} className="flex gap-3">
                      <CheckIcon width={18} height={18} className="mt-1.5 shrink-0 text-green" />
                      <span dangerouslySetInnerHTML={{ __html: it }} />
                    </li>
                  ),
                )}
              </Tag>
            );
          }
          case "image":
            return (
              <figure key={i} className="mt-8">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-surface">
                  <Image src={b.src} alt={b.alt} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" unoptimized={!/cdn\.shopify\.com|shop\.doctorbox\.de/.test(b.src)} />
                </div>
                {b.alt && <figcaption className="mt-2 text-sm text-ink-muted">{b.alt}</figcaption>}
              </figure>
            );
          case "quote":
            return <blockquote key={i} className="article-inline mt-8 border-l-4 border-lind-deep pl-5 text-xl leading-relaxed text-moss" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "cards":
            return (
              <ul key={i} className="mt-6 grid gap-3 sm:grid-cols-2">
                {b.items.map((c, k) => (
                  <li key={k} className="rounded-2xl bg-surface p-5">
                    <h3 className="font-semibold leading-snug text-moss">{c.title}</h3>
                    <p className="article-inline mt-2 text-[0.98rem] leading-relaxed text-ink-muted" dangerouslySetInnerHTML={{ __html: c.html }} />
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside key={i} className="mt-8 rounded-2xl border-l-4 border-green bg-lind/50 p-5">
                {b.title && <p className="font-semibold text-moss">{b.title}</p>}
                <p className="article-inline mt-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: b.html }} />
              </aside>
            );
        }
      })}
    </div>
  );
}
