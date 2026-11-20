import type { Metadata } from "next";
import { BlackFridayLanding } from "@/components/promo/BlackFridayLanding";
import { BLACKFRIDAY, blackFridayCopy, blackFridayPhase } from "@/content/blackfriday";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = blackFridayCopy(locale);
  return pageMetadata(locale, BLACKFRIDAY.page, {
    title: t.metaTitle,
    description: t.metaDescription,
    noIndex: blackFridayPhase() === "ended",
  });
}

export default async function BlackFridayPage({ params }: Props) {
  const { locale } = await resolveLocale(params);
  return <BlackFridayLanding locale={locale} phase={blackFridayPhase()} />;
}
