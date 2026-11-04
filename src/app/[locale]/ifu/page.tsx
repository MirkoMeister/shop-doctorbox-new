import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight } from "@/components/ui/Icons";
import { IFU_COPY, IFUS } from "@/content/ifu";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = IFU_COPY[locale];
  return pageMetadata(locale, "/ifu", { title: t.indexTitle, description: t.indexIntro });
}

/** All kit instructions (src/content/ifu.ts). */
export default async function IfuIndexPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = IFU_COPY[locale];
  const href = (path: string) => localeHref(locale, path);
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: href("/") }, { label: t.crumb }]} />
      <h1 className="h1 mt-6">{t.indexTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">{t.indexIntro}</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {IFUS.map((i) => (
          <li key={i.slug}>
            <Link href={href(`/ifu/${i.slug}`)} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-float">
              <span className="font-semibold leading-snug">{i.title[locale]}</span>
              <span className="mt-2 text-sm text-ink-muted">{i.intro[locale]}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green">
                {t.open} <ArrowRight width={14} height={14} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
