"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { shopifyImage } from "@/lib/format";
import type { Image as ShopImage } from "@/lib/shopify/types";
import { ChevronRight } from "@/components/ui/Icons";

export function Gallery({ images, title, activeImageUrl }: { images: ShopImage[]; title: string; activeImageUrl?: string | null }) {
  const [index, setIndex] = useState(0);
  const [seenUrl, setSeenUrl] = useState(activeImageUrl);
  const trackRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  // A newly selected variant image moves the carousel (adjust state during render)
  if (activeImageUrl !== seenUrl) {
    setSeenUrl(activeImageUrl);
    const i = activeImageUrl ? images.findIndex((img) => img.url === activeImageUrl) : -1;
    if (i >= 0 && i !== index) setIndex(i);
  }

  // Keep the scroll position in sync with the index (DOM side effect only)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 2) {
      programmatic.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [index]);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (programmatic.current) {
      if (i === index) programmatic.current = false;
      return;
    }
    if (i !== index) setIndex(i);
  }

  const go = (i: number) => setIndex((i + images.length) % images.length);

  if (!images.length) {
    return <div className="aspect-square rounded-[var(--radius-panel)] bg-surface" />;
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line/60 bg-white">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          aria-roledescription="carousel"
        >
          {images.map((img, i) => (
            <div key={img.url} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={shopifyImage(img.url, 1200)}
                alt={img.altText ?? `${title} – ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-4 sm:p-8"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card hover:bg-white sm:inline-flex"
              aria-label="Previous"
            >
              <ChevronRight className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card hover:bg-white sm:inline-flex"
              aria-label="Next"
            >
              <ChevronRight />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-green" : "w-1.5 bg-ink/20"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto sm:flex">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Bild ${i + 1}`}
                aria-current={i === index}
                className={`relative h-20 w-20 overflow-hidden rounded-2xl border border-line/60 bg-white ring-2 transition-colors ${
                  i === index ? "ring-green" : "ring-transparent hover:ring-lind-deep"
                }`}
              >
                <Image src={shopifyImage(img.url, 200)} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
