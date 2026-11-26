import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlackFridayDealGrid, blackFridayProducts } from "@/components/promo/BlackFridayDeals";
import { BlackFridayLanding } from "@/components/promo/BlackFridayLanding";
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
  const products = blackFridayProducts(group, await getAllProducts(locale).catch(() => []));

  return (
    <BlackFridayLanding locale={locale} phase={phase} group={group}>
      <section id="deals" className="mt-12 scroll-mt-24" aria-labelledby="deals-title">
        <h2 id="deals-title" className="h2 mb-6">{t.testsHeading}</h2>
        <BlackFridayDealGrid products={products} phase={phase} locale={locale} dict={dict} />
      </section>
    </BlackFridayLanding>
  );
}
