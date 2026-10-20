import Image from "next/image";
import Link from "next/link";
import type { Block, Card } from "@/lib/content/article-render";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowRight, CheckIcon } from "@/components/ui/Icons";

const TONE: Record<NonNullable<Card["tone"]>, string> = {
  default: "bg-surface",
  info: "bg-lind/50",
  warn: "bg-okker/35",
  alert: "bg-[#fbe9e6]",
};

function CtaLink({ href, label, className }: { href: string; label: string; className: string }) {
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {label} <ArrowRight width={16} height={16} />
    </a>
  ) : (
    <Link href={href} className={className}>
      {label} <ArrowRight width={16} height={16} />
    </Link>
  );
}

/** Renders extracted article blocks in the shop's own typography. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            if (b.level === 2)
              return (
                <div key={i} className="border-t border-line pt-8 [&:not(:first-child)]:mt-14">
                  {b.kicker && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-green">{b.kicker}</p>}
                  <h2 id={b.id} className="scroll-mt-28 text-[clamp(1.5rem,1.3rem+0.8vw,1.875rem)] font-semibold leading-tight tracking-[-0.02em] text-moss">
                    {b.text}
                  </h2>
                </div>
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
          case "subtitle":
            return <p key={i} className="article-inline mt-3 text-[1.125rem] leading-relaxed text-ink-muted" dangerouslySetInnerHTML={{ __html: b.html }} />;
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
          case "cards": {
            const single = b.items.length === 1;
            return (
              <ul key={i} className={`mt-6 grid gap-3 ${single ? "" : "sm:grid-cols-2"}`}>
                {b.items.map((c, k) => (
                  <li key={k} className={`flex flex-col rounded-2xl p-5 ${TONE[c.tone ?? "default"]}`}>
                    {(c.badge || c.kicker) && (
                      <div className="mb-2 flex items-center gap-2.5">
                        {c.badge && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-semibold text-soft">{c.badge}</span>}
                        {c.kicker && <span className="text-xs font-semibold uppercase tracking-[0.14em] text-green">{c.kicker}</span>}
                      </div>
                    )}
                    {c.title && <h3 className="font-semibold leading-snug text-moss">{c.title}</h3>}
                    {c.html && <p className="article-inline mt-2 text-[0.98rem] leading-relaxed text-ink/85" dangerouslySetInnerHTML={{ __html: c.html }} />}
                    {c.points && c.points.length > 0 && (
                      <ul className="article-inline mt-3 space-y-1.5 text-[0.95rem]">
                        {c.points.map((p, j) => (
                          <li key={j} className="flex gap-2">
                            <CheckIcon width={16} height={16} className="mt-1 shrink-0 text-green" />
                            <span dangerouslySetInnerHTML={{ __html: p }} />
                          </li>
                        ))}
                      </ul>
                    )}
                    {c.note && <p className="article-inline mt-3 border-t border-ink/10 pt-3 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: c.note }} />}
                  </li>
                ))}
              </ul>
            );
          }
          case "stats":
            return (
              <ul key={i} className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {b.items.map((s, k) => (
                  <li key={k} className="rounded-2xl bg-lind/50 p-4">
                    <span className="block text-2xl font-semibold tabular-nums text-moss">{s.value}</span>
                    <span className="mt-1 block text-sm leading-snug text-ink-muted">{s.label}</span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <div key={i} className="mt-8 rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card sm:p-6">
                {b.title && <h3 className="mb-4 font-semibold text-moss">{b.title}</h3>}
                <ol className="space-y-4">
                  {b.items.map((it, k) => (
                    <li key={k} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{k + 1}</span>
                      <p className="article-inline pt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: it }} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          case "faq":
            return (
              <div key={i} className="mt-6">
                <Accordion items={b.items.map((f) => ({ title: f.q, content: <p className="article-inline" dangerouslySetInnerHTML={{ __html: f.a }} /> }))} />
              </div>
            );
          case "callout":
            return (
              <aside key={i} className="mt-8 rounded-2xl border-l-4 border-green bg-lind/50 p-5">
                {b.title && <p className="font-semibold text-moss">{b.title}</p>}
                <p className="article-inline mt-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: b.html }} />
                {b.cta && <CtaLink href={b.cta.href} label={b.cta.label} className="btn btn-secondary btn-sm mt-4" />}
              </aside>
            );
          case "conclusion":
            return (
              <section key={i} className="mt-14 rounded-[var(--radius-panel)] bg-moss p-6 text-soft sm:p-8">
                <h2 className="h3">{b.title}</h2>
                {b.html && <div className="article-inline article-inline--dark mt-3 text-[1.05rem] leading-relaxed text-soft/85" dangerouslySetInnerHTML={{ __html: b.html }} />}
                {b.cta && <CtaLink href={b.cta.href} label={b.cta.label} className="btn btn-on-dark mt-6" />}
              </section>
            );
        }
      })}
    </div>
  );
}
