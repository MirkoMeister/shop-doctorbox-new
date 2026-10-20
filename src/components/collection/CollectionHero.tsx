import Image from "next/image";
import { HeroCta } from "@/components/collection/HeroCta";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon } from "@/components/ui/Icons";
import type { CollectionHero as HeroCopy } from "@/content/collection-heroes";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Full-bleed hero for topic collections: photo backdrop, message and one call to
 * action that opens the Mira drawer. Marked data-hero="dark" so the transparent
 * header switches to light colours.
 */
export function CollectionHero({
  locale,
  dict,
  copy,
  crumbs,
  image,
}: {
  locale: Locale;
  dict: Dictionary;
  copy: HeroCopy;
  crumbs: Crumb[];
  image?: string | null;
}) {
  void locale;
  return (
    <section data-hero="dark" className="relative -mt-[72px] bg-moss text-soft lg:-mt-[88px]">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {image ? (
          <>
            <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
            {/* no colour tint: only a neutral scrim where the copy sits so white text stays legible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/50 lg:bg-gradient-to-r lg:from-black/55 lg:via-black/25 lg:to-transparent" />
          </>
        ) : (
          <>
            <Image src="/brand/shape-tunnel.svg" alt="" width={369} height={369} className="absolute -left-24 -top-24 w-[320px] opacity-[0.14] lg:w-[520px]" />
            <Image src="/brand/shape-circle.svg" alt="" width={369} height={369} className="absolute -bottom-32 right-[36%] w-[260px] opacity-[0.12] lg:w-[420px]" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_20%,rgba(126,195,161,0.22),transparent_60%)]" />
          </>
        )}
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-[6.5rem] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[9rem]">
        <div className="min-w-0 max-w-2xl">
          <Breadcrumbs items={crumbs} className="mb-6 [&_*]:text-soft/70 [&_[aria-current]]:text-soft" />
          <p className="text-sm font-medium text-turquoise">{copy.kicker}</p>
          <h1 className="h-display mt-3 text-balance">
            <Highlight text={copy.headline} tone="dark" />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-soft/85">{copy.lead}</p>
          <HeroCta label={dict.collection.heroMiraCta} hint={copy.chat.chips[0]} chat={copy.chat} />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {copy.facts.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[0.95rem] text-soft/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-turquoise/25 text-turquoise">
                  <CheckIcon width={12} height={12} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
