import { stripHtml } from "@/lib/format";

/**
 * Prepares migrated guide HTML for the reading layout:
 *  - pulls the H1 and the lead paragraph out of the body
 *  - removes the theme's inline product CTA blocks and remembers the product handles
 *  - gives every H2 an id and returns a table of contents
 *  - estimates reading time
 */
export type PreparedGuide = {
  title: string | null;
  lead: string | null;
  bodyHtml: string;
  toc: { id: string; text: string }[];
  productHandles: string[];
  readingMinutes: number;
  words: number;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export function prepareGuide(html: string): PreparedGuide {
  let body = html;

  // 1) Title
  let title: string | null = null;
  body = body.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/i, (_, inner) => {
    title = stripHtml(inner);
    return "";
  });

  const productHandles: string[] = [];

  // 1b) Embedded product cards ("Empfohlener Heimtest" + name + features + price): remember handle, drop block
  body = body.replace(
    /<h3>\s*(?:Empfohlener? Heimtests?|Recommended home tests?|Passender Heimtest)\s*<\/h3>[\s\S]*?(?=<h2[\s>]|$)/gi,
    (block: string) => {
      for (const m of block.matchAll(/href="(?:\/en)?\/products\/([^"?#/]+)/g)) {
        const h = decodeURIComponent(m[1]);
        if (!productHandles.includes(h)) productHandles.push(h);
      }
      return "";
    },
  );

  // 1c) Short closing CTA sections ("Bereit für den nächsten Schritt?" + one sentence + link) → our own teaser replaces them
  body = body.replace(/<h2>[\s\S]*?(?=<h2[\s>]|$)/g, (section: string) => {
    const hasProductLink = /href="(?:\/en)?\/products\//.test(section);
    if (hasProductLink && stripHtml(section).length < 350) {
      for (const m of section.matchAll(/href="(?:\/en)?\/products\/([^"?#/]+)/g)) {
        const h = decodeURIComponent(m[1]);
        if (!productHandles.includes(h)) productHandles.push(h);
      }
      return "";
    }
    return section;
  });

  // 2) Product CTA blocks: any <div> whose content links to /products/ and contains no headline/paragraph
  const divBlock = /<div>\s*((?:(?!<div>)[\s\S])*?)<\/div>/g; // innermost divs
  let changed = true;
  while (changed) {
    changed = false;
    body = body.replace(divBlock, (block, inner: string) => {
      const links = Array.from(inner.matchAll(/href="(?:\/en)?\/products\/([^"?#/]+)/g)).map((m) => decodeURIComponent(m[1]));
      const hasText = /<(h[1-6]|p|ul|ol|table)\b/.test(inner);
      if (links.length && !hasText) {
        // product CTA block → remember handle, drop markup
        for (const h of links) if (!productHandles.includes(h)) productHandles.push(h);
        changed = true;
        return "";
      }
      if (!hasText && /<img\b/.test(inner) && stripHtml(inner).length < 80) {
        // product image + "Zum Test" caption without its own link: part of a CTA block → drop
        changed = true;
        return "";
      }
      if (!hasText) {
        // plain wrapper (e.g. kicker text) → unwrap so an outer CTA wrapper becomes innermost
        changed = true;
        return stripHtml(inner) ? `<p>${inner.trim()}</p>` : "";
      }
      // keep structural wrapper but unwrap it (we style paragraphs, not divs)
      changed = true;
      return inner;
    });
  }
  // Paragraphs that only hold a product link
  body = body.replace(/<p>\s*<a href="(?:\/en)?\/products\/([^"?#/]+)[^"]*">[^<]{0,60}<\/a>\s*<\/p>/g, (_, h: string) => {
    if (!productHandles.includes(h)) productHandles.push(h);
    return "";
  });
  // Stray CTA captions and empty paragraphs
  body = body.replace(/<p>\s*(Zum Test|To the test|Jetzt testen)\s*<\/p>/gi, "").replace(/<p>\s*<\/p>/g, "");

  // 3) Lead: first paragraph before the first H2
  let lead: string | null = null;
  const firstH2 = body.search(/<h2[\s>]/i);
  const head = firstH2 === -1 ? body : body.slice(0, firstH2);
  const firstP = head.match(/<p>([\s\S]*?)<\/p>/);
  if (firstP && stripHtml(firstP[1]).length > 40) {
    lead = stripHtml(firstP[1]);
    body = body.replace(firstP[0], "");
  }

  // 4) Table of contents + ids
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  body = body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = stripHtml(inner);
    let id = slugify(text) || `abschnitt-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  // 5) Reading time
  const words = stripHtml(body).split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  return { title, lead, bodyHtml: body.trim(), toc, productHandles, readingMinutes, words };
}
