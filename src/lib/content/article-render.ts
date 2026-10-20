import { stripHtml } from "@/lib/format";

/**
 * Turns Shopify blog HTML (three different authoring templates, inline styles,
 * card grids, icon images, checkbox self-tests …) into plain content blocks.
 * Only the text survives; the shop renders the blocks in its own design.
 */
export type Inline = string; // sanitised inline HTML: text, <strong>, <em>, <a href>, <br>

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string }
  | { type: "paragraph"; html: Inline }
  | { type: "list"; ordered: boolean; items: Inline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "quote"; html: Inline }
  | { type: "cards"; items: { title: string; html: Inline }[] }
  | { type: "callout"; title: string | null; html: Inline };

export type ExtractedArticle = {
  kicker: string | null;
  lead: string | null;
  blocks: Block[];
  toc: { id: string; text: string }[];
  words: number;
  readingMinutes: number;
};

const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "img", "td", "th"]);
const SKIP_TAGS = new Set(["style", "script", "link", "noscript", "svg", "button", "form", "select", "textarea", "iframe", "input", "nav", "header", "footer", "aside"]);
const KEEP_INLINE = new Set(["strong", "b", "em", "i", "a", "br", "sup", "sub"]);
const VOID_TAGS = new Set(["br", "img", "hr", "input", "link", "meta", "source", "wbr", "col", "embed", "track", "area", "base"]);

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

function isContentImage(src: string, alt: string): boolean {
  if (!/^https?:\/\//.test(src)) return false;
  if (/\.svg(\?|$)/i.test(src)) return false;
  if (/\/\d{2,3}x\d{2,3}\//.test(src)) return false; // storyblok icon sizes like /512x512/
  if (/symbol|icon|logo/i.test(alt)) return false;
  return true;
}

function rewriteHref(href: string): string {
  let h = href.replace(/https?:\/\/shop\.doctorbox\.de/, "");
  const art = h.match(/^(\/en)?\/blogs\/[^/]+\/([^/?#]+)/);
  if (art) h = `${art[1] ?? ""}/ratgeber/${art[2]}`;
  return h;
}

/** Minimal tokenizer: emits tags and text in order. */
function* tokens(html: string): Generator<{ kind: "open" | "close" | "text"; tag?: string; attrs?: string; text?: string; selfClosing?: boolean }> {
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[1]) yield { kind: "close", tag: m[1].toLowerCase() };
    else if (m[2]) {
      const tag = m[2].toLowerCase();
      yield { kind: "open", tag, attrs: m[3] ?? "", selfClosing: Boolean(m[4]) || VOID_TAGS.has(tag) };
    }
    else if (m[5]) yield { kind: "text", text: m[5] };
  }
}

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1] ?? attrs.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`, "i"))?.[1] ?? null;

export function extractArticle(html: string): ExtractedArticle {
  const blocks: Block[] = [];
  let kicker: string | null = null;

  // current block being collected
  let current: { tag: string; cls: string; parts: string[] } | null = null;
  const listStack: { ordered: boolean; items: Inline[] }[] = [];
  let skipDepth = 0;
  const skipStack: string[] = [];
  let inlineOpen: string[] = [];
  let sawH1 = false;

  const flush = () => {
    if (!current) return;
    const { tag, cls, parts } = current;
    current = null;
    // close dangling inline tags
    let html = parts.join("");
    for (const t of inlineOpen.reverse()) html += `</${t}>`;
    inlineOpen = [];
    html = html.replace(/\s+/g, " ").trim().replace(/^(<br>\s*)+|(\s*<br>)+$/g, "");
    const text = decode(stripHtml(html)).trim(); // plain text for headings/kicker (React escapes on render)
    if (!text) return;
    if (tag === "li") {
      const list = listStack[listStack.length - 1];
      if (list) list.items.push(html);
      else blocks.push({ type: "list", ordered: false, items: [html] });
      return;
    }
    if (tag === "h1") {
      sawH1 = true;
      return;
    }
    if (/^h[2-6]$/.test(tag)) {
      const level = Math.min(4, Math.max(2, Number(tag[1]))) as 2 | 3 | 4;
      blocks.push({ type: "heading", level, text });
      return;
    }
    if (tag === "blockquote") {
      blocks.push({ type: "quote", html });
      return;
    }
    if (/eyebrow|kicker|category/.test(cls) && !kicker && text.length < 80) {
      kicker = text;
      return;
    }
    blocks.push({ type: "paragraph", html });
  };

  for (const tk of tokens(html)) {
    if (tk.kind === "open") {
      const tag = tk.tag!;
      if (SKIP_TAGS.has(tag)) {
        if (!tk.selfClosing) {
          skipDepth++;
          skipStack.push(tag);
        }
        continue;
      }
      if (skipDepth) continue;
      if (tag === "img") {
        const src = attr(tk.attrs!, "src") ?? attr(tk.attrs!, "data-src") ?? "";
        const alt = decode(attr(tk.attrs!, "alt") ?? "");
        if (isContentImage(src, alt)) {
          flush();
          blocks.push({ type: "image", src, alt });
        }
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        flush();
        listStack.push({ ordered: tag === "ol", items: [] });
        continue;
      }
      if (BLOCK_TAGS.has(tag)) {
        flush();
        current = { tag, cls: attr(tk.attrs!, "class") ?? "", parts: [] };
        continue;
      }
      if (KEEP_INLINE.has(tag) && current) {
        if (tag === "br") {
          current.parts.push("<br>");
        } else if (tag === "a") {
          const href = attr(tk.attrs!, "href");
          if (href && !/^javascript:/i.test(href)) {
            const h = rewriteHref(href);
            const external = /^https?:\/\//.test(h);
            current.parts.push(`<a href="${escape(h)}"${external ? ' target="_blank" rel="noopener"' : ""}>`);
            inlineOpen.push("a");
          }
        } else {
          const t = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
          current.parts.push(`<${t}>`);
          inlineOpen.push(t);
        }
        continue;
      }
      // div/section/article/span/label … : structural, ignored. A div that directly holds text acts like a paragraph.
      continue;
    }
    if (tk.kind === "close") {
      const tag = tk.tag!;
      if (SKIP_TAGS.has(tag)) {
        if (skipStack[skipStack.length - 1] === tag) {
          skipStack.pop();
          skipDepth = Math.max(0, skipDepth - 1);
        }
        continue;
      }
      if (skipDepth) continue;
      if (tag === "ul" || tag === "ol") {
        flush();
        const list = listStack.pop();
        if (list && list.items.length) {
          const parent = listStack[listStack.length - 1];
          if (parent && parent.items.length) {
            // nested list → append items to parent's last item
            parent.items[parent.items.length - 1] += `<ul>${list.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
          } else blocks.push({ type: "list", ordered: list.ordered, items: list.items });
        }
        continue;
      }
      if (BLOCK_TAGS.has(tag)) {
        if (current && current.tag === tag) flush();
        continue;
      }
      if (KEEP_INLINE.has(tag) && current) {
        const t = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
        const idx = inlineOpen.lastIndexOf(t);
        if (idx !== -1) {
          current.parts.push(`</${t}>`);
          inlineOpen.splice(idx, 1);
        }
        continue;
      }
      continue;
    }
    // text
    if (skipDepth) continue;
    const raw = tk.text!;
    if (!raw.trim()) {
      if (current) current.parts.push(" ");
      continue;
    }
    if (!current) {
      // loose text inside a div/span → treat as its own paragraph
      current = { tag: "p", cls: "", parts: [] };
    }
    current.parts.push(escape(decode(raw)).replace(/&amp;(amp;)+/g, "&amp;"));
  }
  flush();
  void sawH1;

  // Lead: first paragraph (before the first heading) if long enough
  let lead: string | null = null;
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  const leadIdx = blocks.findIndex((b, i) => b.type === "paragraph" && (firstHeading === -1 || i < firstHeading) && stripHtml(b.html).length > 60);
  if (leadIdx !== -1) {
    lead = decode(stripHtml((blocks[leadIdx] as { html: string }).html));
    blocks.splice(leadIdx, 1);
  }

  // Group runs of [h3/h4 + single paragraph] (≥3) into card grids
  const grouped: Block[] = [];
  for (let i = 0; i < blocks.length; ) {
    const run: { title: string; html: Inline }[] = [];
    let j = i;
    while (j + 1 < blocks.length) {
      const h = blocks[j];
      const p = blocks[j + 1];
      const next = blocks[j + 2];
      if (h.type === "heading" && h.level >= 3 && p.type === "paragraph" && (!next || next.type !== "paragraph")) {
        run.push({ title: h.text, html: p.html });
        j += 2;
      } else break;
    }
    if (run.length >= 3) {
      grouped.push({ type: "cards", items: run });
      i = j;
    } else {
      grouped.push(blocks[i]);
      i++;
    }
  }

  // h4 followed by a paragraph → callout
  const final: Block[] = [];
  for (let i = 0; i < grouped.length; i++) {
    const b = grouped[i];
    const n = grouped[i + 1];
    if (b.type === "heading" && b.level === 4 && n && n.type === "paragraph") {
      final.push({ type: "callout", title: b.text, html: n.html });
      i++;
    } else final.push(b);
  }

  // TOC from h2
  const used = new Set<string>();
  const toc: { id: string; text: string }[] = [];
  for (const b of final) {
    if (b.type === "heading" && b.level === 2) {
      let id = slugify(b.text) || `abschnitt-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      b.id = id;
      toc.push({ id, text: b.text });
    }
  }

  const words = final
    .map((b) => ("html" in b ? stripHtml(b.html) : "text" in b ? b.text : b.type === "list" ? b.items.map(stripHtml).join(" ") : b.type === "cards" ? b.items.map((c) => c.title + " " + stripHtml(c.html)).join(" ") : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return { kicker, lead, blocks: final, toc, words, readingMinutes: Math.max(1, Math.round(words / 200)) };
}
