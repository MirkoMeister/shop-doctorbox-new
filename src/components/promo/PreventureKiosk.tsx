"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Moustache } from "@/components/promo/Moustache";
import { PharmacyMap } from "@/components/promo/PharmacyMap";
import { Highlight } from "@/components/ui/Highlight";
import { MOVEMBER } from "@/content/movember";
import { PREVENTURE, preventureCopy as t } from "@/content/preventure";
import { TASSO_POSTER, TASSO_VIDEO } from "@/content/tasso";
import { fill } from "@/lib/i18n/dictionaries";
import { formatMoney, shopifyImage } from "@/lib/format";

type SlideKey = "video" | "steps" | "pharmacy" | "sets" | "offer" | "movember";

/** a prevention set on the sets slide */
export type KioskSet = { handle: string; title: string; image: string | null; values: number; sample: string | null; price: { amount: string; currencyCode: string } };

/** Movember slide, only while the campaign runs; image: the same photo as on /pages/movember */
export type KioskMovember = { image: string | null };

const pct = { percent: PREVENTURE.percent };
/** length of the Tasso video, for its progress bar (the slide itself ends with the video) */
const VIDEO_SECONDS = 19;
/** same photo as the home page hero (components/home/Hero.tsx) */
const HOME_HERO = "/hero/hero.jpg";

/**
 * Tablet slideshow for the PREVENTURE stand: Tasso video → three steps → prevention sets → offer with QR
 * code → Movember (while it runs). Runs on its own in a loop; a tap moves on. Covers the shop header and footer, keeps the screen
 * awake (Wake Lock) and offers fullscreen when it is not already running as an installed app.
 */
export function PreventureKiosk({ sets, movember }: { sets: KioskSet[]; movember: KioskMovember | null }) {
  const slides: SlideKey[] = [
    "video",
    "steps",
    "pharmacy",
    ...(sets.length ? (["sets"] as const) : []),
    "offer",
    ...(movember ? (["movember"] as const) : []),
  ];
  const [index, setIndex] = useState(0);
  const [standalone, setStandalone] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slide = slides[index];

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);

  // timed slides; the video slide ends with the video
  useEffect(() => {
    if (slide === "video") {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
      // fallback in case the video cannot play (no autoplay, network)
      const guard = window.setTimeout(next, 30_000);
      return () => window.clearTimeout(guard);
    }
    const id = window.setTimeout(next, PREVENTURE.seconds[slide] * 1000);
    return () => window.clearTimeout(id);
  }, [slide, next]);

  // keep the tablet awake while the page is visible
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = () => {
      if (document.visibilityState === "visible" && "wakeLock" in navigator) {
        navigator.wakeLock.request("screen").then((l) => (lock = l)).catch(() => {});
      }
    };
    request();
    document.addEventListener("visibilitychange", request);
    return () => {
      document.removeEventListener("visibilitychange", request);
      lock?.release().catch(() => {});
    };
  }, []);

  // installed as an app (fullscreen/standalone): no fullscreen button needed
  useEffect(() => {
    const mq = window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)");
    const update = () => setStandalone(mq.matches || Boolean(document.fullscreenElement));
    update();
    mq.addEventListener("change", update);
    document.addEventListener("fullscreenchange", update);
    return () => {
      mq.removeEventListener("change", update);
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  // the shop around it must not scroll
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] cursor-none select-none overflow-hidden bg-moss text-soft"
      onClick={next}
      role="region"
      aria-roledescription="Slideshow"
      aria-label={t.metaTitle}
    >
      {/* progress, one bar per slide */}
      <div className="absolute inset-x-6 top-5 z-20 flex gap-2" aria-hidden>
        {slides.map((s, i) => (
          <span key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <span
              key={i === index ? `run-${index}` : s}
              className={`block h-full rounded-full bg-soft ${i < index ? "w-full" : i === index ? "kiosk-bar" : "w-0"}`}
              style={i === index ? { animationDuration: `${slide === "video" ? VIDEO_SECONDS : PREVENTURE.seconds[slide]}s` } : undefined}
            />
          </span>
        ))}
      </div>

      {/* top row: logo and event */}
      <div className="absolute inset-x-6 top-10 z-20 flex items-center justify-between">
        <Image src="/brand/logo-white.svg" alt="DoctorBox" width={64} height={56} className="h-10 w-auto drop-shadow" priority />
        <span className="text-sm font-medium text-soft/80">{t.event}</span>
      </div>

      {/* 1: Tasso video */}
      <section className={`kiosk-slide ${slide === "video" ? "is-active" : ""}`} aria-hidden={slide !== "video"}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={TASSO_VIDEO}
          poster={TASSO_POSTER}
          muted
          playsInline
          preload="auto"
          onEnded={next}
          aria-label={t.video.label}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moss-deep via-moss-deep/30 to-moss-deep/40" />
        {/* bottom padding keeps the text clear of the QR corner */}
        <div className="absolute inset-x-0 bottom-0 p-8 pb-36 sm:p-14 sm:pb-36 lg:pr-[22rem] lg:pb-14">
          <p className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"><Highlight text={t.video.title} tone="dark" /></p>
          <p className="mt-4 max-w-2xl text-lg text-soft/85 sm:text-2xl">{t.video.text}</p>
        </div>
      </section>

      {/* 2: three steps, next to the set on a table and Tasso+ on the arm */}
      <section className={`kiosk-slide grid items-center gap-10 px-8 sm:px-14 lg:grid-cols-[1fr_1.15fr] lg:gap-14 ${slide === "steps" ? "is-active" : ""}`} aria-hidden={slide !== "steps"}>
        <div className="relative mx-auto hidden aspect-square w-full max-w-[480px] lg:block">
          <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-panel)]">
            <Image src={shopifyImage(PREVENTURE.images.kit, 1000)} alt="DoctorBox Probenahme-Set" fill sizes="480px" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 size-44 overflow-hidden rounded-[var(--radius-card)] border-4 border-moss shadow-2xl">
            <Image src={shopifyImage(PREVENTURE.images.tasso, 400)} alt="Tasso+ am Oberarm" fill sizes="176px" className="object-cover" />
          </div>
        </div>
        <div>
          <p className="text-4xl font-semibold tracking-tight sm:text-6xl"><Highlight text={t.steps.title} tone="dark" /></p>
          <ol className="mt-8 space-y-4 sm:mt-10">
            {t.steps.items.map((s, i) => (
              <li key={s.title} className="flex items-start gap-5 rounded-[var(--radius-card)] bg-white/[0.07] p-5 sm:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-turquoise text-xl font-semibold text-moss-deep">{i + 1}</span>
                <span>
                  <span className="block text-2xl font-semibold">{s.title}</span>
                  <span className="mt-1 block text-lg leading-snug text-soft/80">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3: blood sampling in partner pharmacies, map of Germany */}
      <section className={`kiosk-slide grid items-center gap-10 px-8 sm:px-14 lg:grid-cols-[1.1fr_1fr] ${slide === "pharmacy" ? "is-active" : ""}`} aria-hidden={slide !== "pharmacy"}>
        <div>
          <p className="text-4xl font-semibold tracking-tight sm:text-6xl">
            <Highlight text={t.pharmacy.title} tone="dark" />
          </p>
          <p className="mt-5 max-w-xl text-xl text-soft/85 sm:text-2xl">{t.pharmacy.text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-soft/80">
            <span className="font-medium text-soft">{t.pharmacy.legend}</span>
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 20 22" className="h-5 w-5" aria-hidden><polygon points="10,1 19,6 19,16 10,21 1,16 1,6" fill="#cbdfc6" /></svg>
              {t.pharmacy.one}
            </span>
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 20 22" className="h-5 w-5" aria-hidden><polygon points="10,1 19,6 19,16 10,21 1,16 1,6" fill="#0e834b" /></svg>
              {t.pharmacy.more}
            </span>
          </div>
        </div>
        <PharmacyMap label={t.pharmacy.mapLabel} className="mx-auto h-[min(70vh,640px)] w-auto max-w-full" />
      </section>

      {/* 4: classic prevention sets */}
      {sets.length > 0 && (
        <section className={`kiosk-slide flex flex-col justify-center px-8 sm:px-14 ${slide === "sets" ? "is-active" : ""}`} aria-hidden={slide !== "sets"}>
          <p className="text-4xl font-semibold tracking-tight sm:text-5xl"><Highlight text={t.sets.title} tone="dark" /></p>
          <p className="mt-3 text-xl text-soft/85 sm:text-2xl">{fill(t.sets.note, { code: PREVENTURE.code, percent: PREVENTURE.percent })}</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
            {sets.map((p) => (
              <li key={p.handle} className="flex items-center gap-4 overflow-hidden rounded-[var(--radius-card)] bg-soft p-3 pr-5 text-ink">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-white sm:size-28">
                  {p.image && <Image src={shopifyImage(p.image, 300)} alt="" fill sizes="112px" className="object-contain p-2" />}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-tight sm:text-xl">{p.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {[p.values === 1 ? t.sets.value : p.values > 1 ? fill(t.sets.values, { n: p.values }) : null, p.sample].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1.5 text-base font-semibold tabular-nums text-green">{fill(t.sets.from, { price: formatMoney(p.price, "de") })}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5: the offer, QR code to the shop with the code */}
      <section className={`kiosk-slide flex items-center px-8 sm:px-14 ${slide === "offer" ? "is-active" : ""}`} aria-hidden={slide !== "offer"}>
        {/* the photo from the home page hero, mirrored like there so the person stands on the right */}
        <Image src={HOME_HERO} alt="" fill sizes="100vw" className="hero-photo-mirror object-cover object-[72%_center] lg:object-[center_35%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-moss-deep/85 via-moss-deep/70 to-moss-deep/90 lg:bg-gradient-to-r lg:from-moss-deep/95 lg:via-moss-deep/75 lg:to-transparent" />
        <div className="relative max-w-2xl">
          <p className="text-lg font-medium text-turquoise sm:text-xl">{t.offer.kicker}</p>
          <p className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl"><Highlight text={fill(t.offer.title, pct)} tone="dark" /></p>
          <p className="mt-4 max-w-xl text-lg text-soft/85 sm:text-xl">{t.offer.text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex w-48 flex-col items-center rounded-[var(--radius-card)] bg-white p-4 text-ink shadow-2xl sm:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
              <img src={PREVENTURE.qrImage} alt={`QR-Code zum Shop mit Code ${PREVENTURE.code}`} className="aspect-square w-full" />
              <p className="mt-3 text-sm font-semibold">{PREVENTURE.shortUrl}</p>
            </div>
            <div>
              <p className="text-base text-soft/75">{t.offer.codeLabel}</p>
              <p className="mt-2 inline-block rounded-2xl border-2 border-dashed border-turquoise bg-moss-deep/40 px-6 py-3 font-mono text-3xl font-semibold tracking-[0.12em] sm:text-4xl">{PREVENTURE.code}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6: Movember, with the photo and code of the Movember page */}
      {movember && (
        <section className={`kiosk-slide !p-0 ${slide === "movember" ? "is-active" : ""}`} aria-hidden={slide !== "movember"}>
          {movember.image && <Image src={shopifyImage(movember.image, 2000)} alt="" fill sizes="100vw" className="object-cover object-[center_30%]" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061a10] via-[#061a10]/85 to-[#061a10]/30" />
          <Moustache className="absolute -right-12 top-24 hidden w-[480px] text-soft/10 lg:block" />
          <div className="relative flex h-full items-center px-8 pb-16 pt-28 sm:px-14">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-3 text-lg font-medium text-okker sm:text-xl">
                <Moustache className="w-10 text-okker" />
                {t.movember.kicker}
              </p>
              <p className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
                <Highlight text={t.movember.title} tone="dark" />
              </p>
              <p className="mt-5 max-w-xl text-xl text-soft/85 sm:text-2xl">{fill(t.movember.text, { percent: MOVEMBER.percent })}</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex w-52 flex-col items-center rounded-[var(--radius-card)] bg-white p-4 text-ink shadow-2xl sm:w-60">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
                  <img src={PREVENTURE.movemberQrImage} alt={`QR-Code zur Movember-Aktion mit Code ${MOVEMBER.code}`} className="aspect-square w-full" />
                  <p className="mt-3 text-sm font-semibold">{PREVENTURE.shortUrl}</p>
                </div>
                <div>
                  <p className="text-base text-soft/75">{t.movember.until}</p>
                  <p className="mt-2 inline-block rounded-2xl border-2 border-dashed border-okker bg-moss-deep/40 px-6 py-3 font-mono text-3xl font-semibold tracking-[0.12em] sm:text-4xl">{MOVEMBER.code}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* always visible on the other slides: the code in the corner */}
      {slide !== "offer" && slide !== "movember" && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 text-ink shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
          <img src={PREVENTURE.qrImage} alt="" className="size-20" />
          <span className="leading-tight">
            <span className="block text-sm text-ink-muted">{fill(t.corner, pct)}</span>
            <span className="block font-mono text-lg font-semibold tracking-wider">{PREVENTURE.code}</span>
          </span>
        </div>
      )}

      {!standalone && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            document.documentElement.requestFullscreen?.().catch(() => {});
          }}
          className="absolute bottom-6 left-6 z-20 cursor-pointer rounded-full border border-white/30 px-4 py-2 text-sm text-soft/80 hover:bg-white/10"
        >
          {t.fullscreen}
        </button>
      )}
    </div>
  );
}
