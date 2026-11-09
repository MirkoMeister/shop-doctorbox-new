import type { Metadata } from "next";
import { CopyCode } from "@/components/promo/CopyCode";
import { ProductGrid } from "@/components/product/ProductCard";
import { Highlight } from "@/components/ui/Highlight";
import { PREVENTURE, preventureCopy } from "@/content/preventure";
import { fill } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/locale-params";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

const t = preventureCopy.landing;
const vars = { code: PREVENTURE.code, percent: PREVENTURE.percent };

/** Where the QR code on the PREVENTURE stand leads: the six sets PREVENTURE26 applies to. Not indexed, not linked. */
export const metadata: Metadata = { title: t.metaTitle, robots: { index: false, follow: false } };

export default async function PreventureLandingPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const all = await getAllProducts(locale).catch(() => []);
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  const products = PREVENTURE.sets.map((h) => byHandle.get(h)).filter((p): p is NonNullable<typeof p> => Boolean(p?.availableForSale));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <section className="rounded-[var(--radius-panel)] bg-moss px-6 py-10 text-soft sm:px-10 lg:px-14 lg:py-14">
        <p className="text-sm font-medium text-turquoise sm:text-base">{t.kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          <Highlight text={fill(t.title, vars)} tone="dark" />
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-soft/85">{fill(t.text, vars)}</p>
        <div className="mt-6 max-w-sm">
          <CopyCode code={PREVENTURE.code} label={t.codeLabel} copy={t.copy} copied={t.copied} />
        </div>
      </section>
      <section className="mt-10">
        <ProductGrid products={products} locale={locale} dict={dict} priorityCount={3} />
        <p className="mt-6 text-sm text-ink-muted">{t.note}</p>
      </section>
    </div>
  );
}
