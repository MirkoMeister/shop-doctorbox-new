import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductCard";
import { BlackFridayLanding } from "@/components/promo/BlackFridayLanding";
import { DealCard } from "@/components/promo/DealCard";
import { BLACKFRIDAY, blackFridayCopy, blackFridayGroupPath, blackFridayPhase } from "@/content/blackfriday";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  return BLACKFRIDAY.groups.map(({ slug }) => ({ topic: slug }));
}

async function resolveTopic(params: Props["params"]) {
  const { locale, dict, params: { topic } } = await resolveLocale(params);
  const group = BLACKFRIDAY.groups.find(({ slug }) => slug === topic);
  if (!group) notFound();
  return { locale, dict, group, t: blackFridayCopy(locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, group, t } = await resolveTopic(params);
  const topic = t.groups[group.key];
  return pageMetadata(locale, blackFridayGroupPath(group), {
    title: `Black Friday · ${topic.title}`,
    description: topic.text,
    image: `/hero/collections/${group.image}`,
    noIndex: blackFridayPhase() === "ended",
  });
}

export default async function BlackFridayTopicPage({ params }: Props) {
  const { locale, dict, group, t } = await resolveTopic(params);
  const phase = blackFridayPhase();
  const all = await getAllProducts(locale).catch(() => []);
  const byHandle = new Map(all.map((product) => [product.handle, product]));
  const products = group.handles.flatMap((handle) => {
    const product = byHandle.get(handle);
    return product?.availableForSale ? [product] : [];
  });

  return (
    <BlackFridayLanding locale={locale} phase={phase} group={group}>
      <section id="deals" className="mt-12 scroll-mt-24" aria-labelledby="deals-title">
        <h2 id="deals-title" className="h2 mb-6">{t.testsHeading}</h2>
        {products.length === 0 ? (
          <p className="text-ink-muted">{t.unavailable}</p>
        ) : phase === "ended" ? (
          <ProductGrid products={products} locale={locale} dict={dict} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <DealCard product={product} percent={BLACKFRIDAY.percent} badge={t.dealBadge} withCode={t.withCode} instead={t.instead} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </BlackFridayLanding>
  );
}
