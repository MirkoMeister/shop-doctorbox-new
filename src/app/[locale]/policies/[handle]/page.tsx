import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import { RichText } from "@/components/content/RichText";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon } from "@/components/ui/Icons";
import { SUBSCRIPTION_SUMMARY } from "@/content/subscription-policy";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/locale-params";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { getPolicy, POLICY_HANDLES } from "@/lib/shopify/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; handle: string }> };

export function generateStaticParams() {
  return POLICY_HANDLES.map((handle) => ({ handle }));
}

const LABELS: Record<(typeof POLICY_HANDLES)[number], keyof Dictionary["footer"]> = {
  "shipping-policy": "shipping",
  "refund-policy": "refund",
  "privacy-policy": "privacy",
  "terms-of-service": "terms",
  "subscription-policy": "subscriptionPolicy",
  "legal-notice": "imprint",
};

async function loadPolicy(handle: string, locale: Locale): Promise<{ title: string; body: string } | null> {
  if (!(POLICY_HANDLES as readonly string[]).includes(handle)) return null;
  // Impressum is not exposed by the Storefront API → migrated content
  if (handle === "legal-notice") {
    for (const loc of [locale, "de"] as Locale[]) {
      try {
        const raw = await fs.readFile(path.join(process.cwd(), "src", "content", "policies", loc, "legal-notice.json"), "utf8");
        return JSON.parse(raw) as { title: string; body: string };
      } catch {
        /* try next */
      }
    }
    return null;
  }
  const policy = await getPolicy(handle, locale);
  return policy ? { title: policy.title, body: policy.body } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict, params: p } = await resolveLocale(params);
  const policy = await loadPolicy(p.handle, locale);
  if (!policy) return {};
  const label = dict.footer[LABELS[p.handle as (typeof POLICY_HANDLES)[number]]];
  // old robots.txt disallowed /policies/ – keep them out of the index
  return pageMetadata(locale, `/policies/${p.handle}`, { title: label || policy.title, noIndex: true });
}

export default async function PolicyPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const policy = await loadPolicy(p.handle, locale);
  if (!policy) notFound();
  const href = (x: string) => localeHref(locale, x);
  const handle = p.handle as (typeof POLICY_HANDLES)[number];
  const title = dict.footer[LABELS[handle]] || policy.title;
  const sub = handle === "subscription-policy" ? SUBSCRIPTION_SUMMARY[locale] : null;

  const nav = (
    <nav aria-label={dict.footer.legal} className="lg:sticky lg:top-28">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">{dict.footer.legal}</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
        {POLICY_HANDLES.map((h) => {
          const active = h === handle;
          return (
            <li key={h}>
              <Link
                href={href(`/policies/${h}`)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex rounded-full px-3.5 py-1.5 text-sm transition-colors lg:w-full lg:rounded-xl ${
                  active ? "bg-lind font-semibold text-moss" : "text-ink-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {dict.footer[LABELS[h]]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <article className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: href("/") }, { label: title }]} className="mb-6" />

      {sub ? (
        <>
          <JsonLd data={faqJsonLd(sub.faq)} />
          <header className="max-w-3xl">
            <p className="text-sm font-medium text-green">{sub.kicker}</p>
            <h1 className="h1 mt-2 text-balance">
              <Highlight text={sub.headline} />
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{sub.lead}</p>
            <Link href={href("/collections?sub=1")} className="btn btn-primary mt-6">
              {sub.cta}
            </Link>
          </header>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sub.facts.map((f) => (
              <li key={f.title} className="rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lind text-moss">
                  <CheckIcon width={16} height={16} />
                </span>
                <h2 className="mt-3 font-semibold leading-snug">{f.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className={`grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 ${sub ? "mt-16" : ""}`}>
        <div>{nav}</div>
        <div className="min-w-0 max-w-3xl">
          {sub ? (
            <>
              <section aria-labelledby="sub-faq">
                <h2 id="sub-faq" className="h3 mb-4">
                  {sub.faqTitle}
                </h2>
                <Accordion items={sub.faq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
              </section>
              <section className="mt-14" aria-labelledby="sub-legal">
                <h2 id="sub-legal" className="h4 mb-4 text-ink-muted">
                  {sub.legalTitle}
                </h2>
                <RichText html={policy.body} locale={locale} className="!text-[0.95rem] text-ink-muted" />
              </section>
            </>
          ) : (
            <>
              <h1 className="h1 mb-8 text-balance">{title}</h1>
              <RichText html={policy.body} locale={locale} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
