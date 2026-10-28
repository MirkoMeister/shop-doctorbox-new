"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CloseIcon, ShieldIcon } from "@/components/ui/Icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const URL = "https://www.doctorbox.de/krankenkassen";
const KEY = "kk-card-dismissed";

/**
 * Visitors who came for the free bowel-cancer screening of their health insurer
 * are sent to the insurer landing pages: a small card bottom-right (bar on phones)
 * that appears after the hero and can be dismissed for the session.
 */
export function InsuranceCard({ dict }: { dict: Dictionary }) {
  const t = dict.home.insurance;
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        setDismissed(sessionStorage.getItem(KEY) === "1");
      } catch {
        setDismissed(false);
      }
    });
    const onScroll = () => setShown(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const visible = shown && !dismissed;
  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode */
    }
  };

  return (
    <aside
      aria-label={t.title}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="relative border-t border-line/70 bg-white shadow-float sm:rounded-[var(--radius-card)] sm:border">
        <button type="button" onClick={dismiss} aria-label={dict.nav.close} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-ink">
          <CloseIcon width={14} height={14} />
        </button>
        <div className="flex items-start gap-3.5 px-4 pb-4 pt-4 pr-10 sm:p-5 sm:pr-11">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lind text-moss">
            <ShieldIcon width={20} height={20} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-moss">{t.title}</p>
            <p className="mt-1 text-sm leading-snug text-ink-muted">{t.text}</p>
            <a href={URL} rel="noopener" className="btn btn-primary btn-sm mt-3">
              {t.cta} <ArrowRight width={14} height={14} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
