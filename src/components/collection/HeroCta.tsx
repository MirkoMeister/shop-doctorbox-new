"use client";

import { useEffect } from "react";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { ArrowRight } from "@/components/ui/Icons";
import type { CollectionHero } from "@/content/collection-heroes";

/**
 * The one call to action in a collection hero: opens the Mira drawer.
 * While mounted it gives the shared conversation the collection's focus,
 * greeting and starter questions.
 */
export function HeroCta({ label, hint, chat }: { label: string; hint: string; chat: CollectionHero["chat"] }) {
  const { setOpen, setTopic, setPageContext } = useAssistant();

  useEffect(() => {
    setTopic(chat.topic);
    setPageContext({ greeting: chat.greeting, suggestions: chat.chips, title: chat.title });
    return () => {
      setTopic(null);
      setPageContext(null);
    };
  }, [chat, setTopic, setPageContext]);

  return (
    <button
      id="hero-cta"
      type="button"
      onClick={() => setOpen(true)}
      className="group mt-8 inline-flex w-full max-w-xl items-center gap-4 rounded-full bg-white p-2 pr-5 text-left text-ink shadow-float transition-colors hover:bg-soft"
    >
      <MiraAvatar size={48} />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-tight">{label}</span>
        <span className="mt-0.5 block truncate text-sm text-ink-muted">{hint}</span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green text-white transition-transform group-hover:translate-x-0.5">
        <ArrowRight width={18} height={18} />
      </span>
    </button>
  );
}
