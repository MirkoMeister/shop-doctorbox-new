import type { Metadata, Viewport } from "next";
import { PreventureKiosk } from "@/components/promo/PreventureKiosk";
import { movemberActive } from "@/content/movember";
import { preventureCopy } from "@/content/preventure";
import { resolveLocale } from "@/lib/locale-params";
import { getNavCollections } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

/** Stand slideshow: not indexed, not linked; its own manifest makes it installable as a fullscreen app. */
export const metadata: Metadata = {
  title: preventureCopy.metaTitle,
  robots: { index: false, follow: false },
  manifest: "/preventure.webmanifest",
  appleWebApp: { capable: true, title: "DoctorBox", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#0e4d2f" };

export default async function PreventurePage({ params }: Props) {
  const { locale } = await resolveLocale(params);
  const collections = await getNavCollections(locale).catch(() => []);
  // same photo as the Movember page hero
  const movember = movemberActive() ? { image: collections.find((c) => c.handle === "mannergesundheit")?.image?.url ?? null } : null;
  return <PreventureKiosk movember={movember} />;
}
