import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MixFlow } from "@/components/supplement-mix/MixFlow";
import { getRiiseNutrients } from "@/lib/supplement-mix/riise-catalog";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

/** Phase 1 of the personalised mix (issue #12): demo only, unlisted and not indexed */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/vitamine", { title: "Dein persönlicher Nährstoffmix (Demo)", noIndex: true });
}

export const revalidate = 86400;

export default async function VitaminMixPage({ params }: Props) {
  const { locale } = await resolveLocale(params);
  // the questionnaire exists in German only so far
  if (locale !== "de") notFound();
  // names, forms and IDs from Riise's public catalogue (fallback: the briefing's seven nutrients)
  const { nutrients, live } = await getRiiseNutrients();
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <MixFlow nutrients={nutrients} live={live} />
    </div>
  );
}
