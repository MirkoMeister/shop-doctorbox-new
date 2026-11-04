import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight } from "@/components/ui/Icons";
import { IFU_COPY, ifuBySlug, IFUS, type IfuComponent } from "@/content/ifu";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return IFUS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const ifu = ifuBySlug(p.slug);
  if (!ifu) return {};
  return pageMetadata(locale, `/ifu/${ifu.slug}`, { title: ifu.title[locale], description: ifu.intro[locale] });
}

/** One kit's instructions: the DoctorBox instructions and the manufacturers' IFUs per component. */
export default async function IfuPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const ifu = ifuBySlug(p.slug);
  if (!ifu) notFound();
  const t = IFU_COPY[locale];
  const href = (path: string) => localeHref(locale, path);
  const updated = new Date(ifu.updated).toLocaleDateString(locale === "en" ? "en-GB" : "de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: href("/") }, { label: t.crumb, href: href("/ifu") }, { label: ifu.title[locale] }]} />
      <h1 className="h1 mt-6 text-balance">{ifu.title[locale]}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">{ifu.intro[locale]}</p>
      {ifu.related && (
        <Link href={href(ifu.related.href)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green underline underline-offset-4">
          {ifu.related.label[locale]} <ArrowRight width={14} height={14} />
        </Link>
      )}

      <section className="mt-10 rounded-[var(--radius-card)] bg-soft p-6 sm:p-8" aria-labelledby="ours">
        <h2 id="ours" className="h3">{t.ours}</h2>
        <p className="mt-2 max-w-xl text-ink-muted">{t.oursText}</p>
        {ifu.doctorbox ? (
          <a href={ifu.doctorbox} target="_blank" rel="noopener" className="btn btn-primary mt-5">
            {t.oursCta}
          </a>
        ) : (
          <p className="mt-5 text-sm font-semibold text-ink-muted">{t.oursCta}: {t.pending}</p>
        )}
      </section>

      <section className="mt-12" aria-labelledby="components">
        <h2 id="components" className="h3">{t.componentsTitle}</h2>
        {/* table from md, cards below */}
        <div className="mt-5 hidden overflow-hidden rounded-[var(--radius-card)] border border-line md:block">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="bg-surface text-sm text-ink-muted">
              <tr>
                <th scope="col" className="w-20 px-4 py-3">
                  <span className="sr-only">{t.photo}</span>
                </th>
                <th scope="col" className="px-4 py-3 font-medium">{t.component}</th>
                <th scope="col" className="px-4 py-3 font-medium">{t.manufacturer}</th>
                <th scope="col" className="px-4 py-3 font-medium">{t.marking}</th>
                <th scope="col" className="px-4 py-3 font-medium">{t.ifu}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {ifu.components.map((c) => (
                <tr key={c.name} className="align-top">
                  <td className="px-4 py-3">
                    <Thumb c={c} />
                  </td>
                  <th scope="row" className="px-4 py-3 font-semibold">
                    {c.name}
                    {c.usage && <span className="mt-1 block text-sm font-normal text-ink-muted">{c.usage}</span>}
                  </th>
                  <td className="px-4 py-3 text-ink-muted">{c.manufacturer}</td>
                  <td className="whitespace-nowrap px-4 py-3">{c.marking}</td>
                  <td className="whitespace-nowrap px-4 py-3"><IfuCell c={c} locale={locale} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 grid gap-3 md:hidden">
          {ifu.components.map((c) => (
            <li key={c.name} className="rounded-[var(--radius-card)] border border-line bg-white p-4">
              <div className="flex gap-3">
                <Thumb c={c} />
                <div className="min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  {c.usage && <p className="mt-1 text-sm text-ink-muted">{c.usage}</p>}
                  <p className="mt-1 text-sm text-ink-muted">{c.manufacturer}</p>
                </div>
              </div>
              <p className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>{c.marking}</span>
                <IfuCell c={c} locale={locale} />
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-snug text-ink-muted">{t.legend}</p>
        <p className="mt-2 text-xs text-ink-muted">
          {t.updated}: {updated}
        </p>
      </section>
    </div>
  );
}

/** product photo of a component; an empty tile keeps the rows aligned until a photo exists */
function Thumb({ c }: { c: IfuComponent }) {
  return (
    <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-surface">
      {c.image && <Image src={c.image} alt={c.name} fill sizes="56px" className="bg-white object-contain p-1" />}
    </span>
  );
}

function IfuCell({ c, locale }: { c: IfuComponent; locale: Locale }) {
  const t = IFU_COPY[locale];
  return (
    <span className="block">
      <IfuLink c={c} locale={locale} />
      {c.conformity && (
        <a href={c.conformity} target="_blank" rel="noopener" className="mt-1 block text-xs text-green underline underline-offset-2">
          {t.conformity}
        </a>
      )}
    </span>
  );
}

function IfuLink({ c, locale }: { c: IfuComponent; locale: Locale }) {
  const t = IFU_COPY[locale];
  if (c.ifu.href)
    return (
      <span>
        <a href={c.ifu.href} target="_blank" rel="noopener" className="font-semibold text-green underline underline-offset-4">
          {t.ifuLink}
        </a>
        {c.ifu.version && <span className="block text-xs text-ink-muted">{c.ifu.version}</span>}
      </span>
    );
  return <span className="text-ink-muted">{c.ifu.onPack ? t.onPack : c.ifu.required ? t.pending : t.notRequired}</span>;
}
