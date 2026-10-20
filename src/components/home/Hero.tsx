import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { HeroSearch } from "@/components/search/HeroSearch";
import { Highlight } from "@/components/ui/Highlight";

/**
 * Hero with the intelligent search as the central element.
 * Drop a photo at public/hero/hero.jpg and it becomes the backdrop (moss gradient keeps the
 * text readable, the person stays visible on the right). Without a photo the brand shapes show.
 */
const HERO_PHOTO = "/hero/hero.jpg";
const hasPhoto = () => existsSync(path.join(process.cwd(), "public", HERO_PHOTO));

export function Hero({
  locale,
  dict,
  rating,
}: {
  locale: Locale;
  dict: Dictionary;
  rating: { value: number; count: number } | null;
}) {
  const photo = hasPhoto();

  return (
    <section data-hero="dark" className="relative -mt-[72px] bg-moss text-soft lg:-mt-[88px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {photo ? (
          <>
            <Image
              src={HERO_PHOTO}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[72%_center] lg:object-[center_35%]"
            />
            {/* no colour tint: only a neutral scrim where the copy sits so white text stays legible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/50 lg:bg-gradient-to-r lg:from-black/55 lg:via-black/25 lg:to-transparent" />
          </>
        ) : (
          <>
            <Image
              src="/brand/shape-star.svg"
              alt=""
              width={369}
              height={369}
              className="absolute -right-20 -top-24 w-[260px] opacity-[0.22] sm:w-[360px] lg:-right-10 lg:top-[-120px] lg:w-[520px]"
            />
            <Image
              src="/brand/shape-tunnel.svg"
              alt=""
              width={369}
              height={373}
              className="absolute -bottom-28 -left-16 w-[220px] opacity-[0.16] sm:w-[300px] lg:left-[-40px] lg:w-[420px]"
            />
          </>
        )}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-[7.5rem] sm:px-6 sm:pb-32 sm:pt-[8.5rem] lg:px-8 lg:pb-40 lg:pt-[10.5rem]">
        <div className={photo ? "lg:max-w-[58%]" : ""}>
          <p className="rise text-sm font-medium text-turquoise">{dict.hero.kicker}</p>
          <h1 className="rise rise-2 h-display mt-3 max-w-3xl text-balance">
            <Highlight text={dict.hero.title} tone="dark" />
          </h1>
          <p className="rise rise-2 mt-5 max-w-xl text-lg leading-relaxed text-soft/85">{dict.hero.subtitle}</p>

          <div className="rise rise-3 relative z-20 mt-9">
            <HeroSearch locale={locale} dict={dict} />
          </div>

          {rating && (
            <p className="mt-8 flex items-center gap-3 text-sm text-soft/80">
              <span className="stars" style={{ ["--pct" as string]: `${(rating.value / 5) * 100}%` }} aria-hidden />
              <span>
                <strong className="font-semibold text-soft">
                  {rating.value.toLocaleString(locale === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 })}
                </strong>
                {" / 5 "}
                {locale === "en" ? `from ${rating.count.toLocaleString("en-GB")} reviews` : `aus ${rating.count.toLocaleString("de-DE")} Bewertungen`}
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
