import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";

/**
 * 181 of the old shop's 203 pages were built with theme sections, so their
 * content is not available through the Storefront API. They were migrated
 * once from the rendered HTML into src/content/pages/<locale>/<handle>.json.
 */
export type MigratedPage = {
  handle: string;
  title: string;
  seoTitle: string;
  seoDescription: string | null;
  updatedAt: string;
  html: string;
  textLength: number;
};

const root = path.join(process.cwd(), "src", "content", "pages");

export async function getMigratedPage(handle: string, locale: Locale): Promise<MigratedPage | null> {
  if (!/^[a-z0-9-]+$/i.test(handle)) return null;
  const tryRead = async (loc: Locale) => {
    try {
      const raw = await fs.readFile(path.join(root, loc, `${handle}.json`), "utf8");
      return JSON.parse(raw) as MigratedPage;
    } catch {
      return null;
    }
  };
  return (await tryRead(locale)) ?? (await tryRead("de"));
}

export async function listMigratedPages(locale: Locale): Promise<Pick<MigratedPage, "handle" | "title" | "updatedAt">[]> {
  try {
    const files = await fs.readdir(path.join(root, locale));
    const out = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const d = JSON.parse(await fs.readFile(path.join(root, locale, f), "utf8")) as MigratedPage;
          return { handle: d.handle, title: d.title, updatedAt: d.updatedAt };
        }),
    );
    return out;
  } catch {
    return [];
  }
}

/** Curated guide pages shown in navigation ("Ratgeber") */
export const GUIDE_HIGHLIGHTS = [
  "sti",
  "ratgeber-vitamin-d",
  "mannergesundheit",
  "burnout",
  "mudigkeit",
  "nierengesundheit",
  "knochengesundheit",
  "schlaf",
  "entzundung",
  "prostata",
  "biohacking",
  "ratgeber-darmkrebs",
];
