import { stripHtml } from "@/lib/format";
import { stripCampaignParams } from "@/lib/links";
import { classes, cleanText, find, findAll, hasClass, isNode, nodes, parseHtml, textOf, type HChild, type HNode } from "./html-tree";

/**
 * Turns Shopify blog HTML (three different authoring templates, inline styles,
 * card grids, icon images, checkbox self-tests …) into plain content blocks.
 * Only the text survives; the shop renders the blocks in its own design.
 */
export type Inline = string; // sanitised inline HTML: text, <strong>, <em>, <a href>, <br>

export type CardTone = "default" | "warn" | "alert" | "info";
export type Scale = { title: string | null; band: string | null; from: number; to: number; min: number; max: number; ticks: string[]; labels: string[]; note: Inline | null };
export type Card = { title: string; html: Inline; tone?: CardTone; badge?: string; kicker?: string; points?: Inline[]; note?: Inline; value?: string; figure?: Scale };
export type Cta = { label: string; href: string };

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string; kicker?: string }
  | { type: "subtitle"; html: Inline }
  | { type: "paragraph"; html: Inline }
  | { type: "list"; ordered: boolean; items: Inline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "quote"; html: Inline }
  | { type: "cards"; items: Card[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "steps"; title: string | null; items: { title?: string; html: Inline }[] }
  | { type: "faq"; items: { q: string; a: Inline }[] }
  | { type: "callout"; title: string | null; html: Inline; cta?: Cta }
  | { type: "conclusion"; title: string; html: Inline; cta?: Cta }
  | { type: "chart"; title: string | null; bars: { label: string; value: number; high: boolean }[]; marker?: { index: number; label: string }; legend: { high: boolean; label: string }[]; note: Inline | null }
  | { type: "bars"; items: { label: string; value: string; pct: number; tone: CardTone }[]; note: Inline | null }
  | ({ type: "scale" } & Scale)
  | { type: "days"; title: string | null; cells: { label: string; hl: boolean }[]; note: Inline | null }
  | { type: "table"; head: string[]; rows: Inline[][] }
  | { type: "svg"; title: string | null; svg: string; axis: { label: string; left: number }[]; legend: string[]; note: Inline | null }
  | { type: "chips"; items: { label: string; tone: CardTone }[] };

export type ExtractedArticle = {
  kicker: string | null;
  lead: string | null;
  /** products the template links to (product cards, CTAs) */
  productHandles: string[];
  blocks: Block[];
  toc: { id: string; text: string }[];
  words: number;
  readingMinutes: number;
};

const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "img", "td", "th"]);
const SKIP_TAGS = new Set(["style", "script", "link", "noscript", "svg", "button", "form", "select", "textarea", "iframe", "input", "nav", "header", "footer"]);
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
  return stripCampaignParams(href.replace(/https?:\/\/shop\.doctorbox\.de/, ""));
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

function extractLegacy(html: string): ExtractedArticle {
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

  return { kicker, lead, productHandles: [], blocks: final, toc, words, readingMinutes: Math.max(1, Math.round(words / 200)) };
}

/* ------------------------------------------------------------------------------------------ */
/* Templated articles ("BlogPage": hero, panels, cards, timeline, FAQ, Fazit box)              */
/* Detection is generic: "*-card" → card, "*-grid" or a run of cards → grid, <details> → FAQ, */
/* "*-pill" → chip, inline <svg> → brand-coloured vector figure.                               */
/* ------------------------------------------------------------------------------------------ */


const SCALE_CARD = /(^|\s)(scale-card|length-card|range-bar|range-card)(\s|$)/;
const SCALE_TRACK = /(^|\s)(scale-track|length-scale|range-track)(\s|$)/;
/** scale-card / length-card (highlighted band + ticks) and range-bar (gradient track + tick rows) → Scale, else null */
function scaleOf(c: HNode): Scale | null {
  if (!SCALE_CARD.test(cls(c))) return null;
  const track = find(c, (x) => SCALE_TRACK.test(cls(x)));
  if (!track) return null;
  const titleNode = find(c, (x) => /^h[2-4]$/.test(x.tag));
  const band = find(c, (x) => /(^|\s)(scale-band|length-band|range-band)(\s|$)/.test(cls(x)));
  const tickRows = findAll(c, (x) => /(^|\s)(scale-ticks|length-ticks|range-ticks)(\s|$)/.test(cls(x))).map((t) => nodes(t).map((x) => cleanText(textOf(x))).filter(Boolean));
  const num = (t: string) => parseFloat(t.replace(",", ".").replace(/[^\d.]/g, ""));
  const ticks = tickRows[0] ?? [];
  const labels = tickRows[1] ?? [];
  const tickNums = ticks.map(num).filter((n) => !Number.isNaN(n));
  if (tickNums.length < 2) return null;
  const bandText = band ? cleanText(textOf(band)) : null;
  const bandNums = (bandText?.match(/\d+(?:[.,]\d+)?/g) ?? []).map(num);
  const noteNode = find(c, (x) => hasClass(x, "chart-note"));
  const min = Math.min(...tickNums), max = Math.max(...tickNums);
  return { title: titleNode ? cleanText(textOf(titleNode)) : null, band: bandText, from: bandNums[0] ?? min, to: bandNums[1] ?? bandNums[0] ?? max, min, max, ticks, labels, note: noteNode ? tidy(noteNode.children.map((c) => inlineOf(c)).join("")) : null };
}

const isTemplated = (html: string) => /class="[^"]*\b(BlogPage|section-title|hero-text-content|dbx-container|dbx-wrap|dbx-hero)\b/.test(html);

const cls = (n: HNode) => classes(n).join(" ");
const endsWith = (n: HNode, suffix: string) => classes(n).some((c) => c.endsWith(suffix) || c.includes(`${suffix}--`));
const DECOR = (n: HNode) => ["img", "svg", "style", "script", "link", "meta", "input", "button", "i"].includes(n.tag) || /(^|\s)(dot|icon|[a-z-]*-icon|[a-z-]*-dot|icon-badge|[a-z-]*-header)(\s|$)/.test(cls(n));
const toneOfClass = (c: string): CardTone => (/--warn|warning|--risk|risk-medium/.test(c) ? "warn" : /--alert|danger|risk-high|--red/.test(c) ? "alert" : /info|recommendation|--info|risk-low|--good|--best/.test(c) ? "info" : "default");

/** Serialise a subtree to sanitised inline HTML (text, strong/em/a/br; paragraphs become line breaks, lists stay lists). */
function inlineOf(n: HChild): Inline {
  if (!isNode(n)) return escape(n);
  if (DECOR(n) && n.tag !== "i") return "";
  if (n.tag === "br") return "<br>";
  const inner = () => n.children.map((c) => inlineOf(c)).join("");
  if (n.tag === "strong" || n.tag === "b") return `<strong>${inner()}</strong>`;
  if (n.tag === "em" || n.tag === "i") return `<em>${inner()}</em>`;
  if (n.tag === "sup" || n.tag === "sub") return `<${n.tag}>${inner()}</${n.tag}>`;
  if (n.tag === "a") {
    const href = n.attrs.href;
    if (!href || /^javascript:/i.test(href)) return inner();
    const h = rewriteHref(href);
    const external = /^https?:\/\//.test(h);
    return `<a href="${escape(h)}"${external ? ' target="_blank" rel="noopener"' : ""}>${inner()}</a>`;
  }
  if (/(^|\s)[a-z-]*pill(\s|$|--)/.test(cls(n))) return `<span class="pill pill-${toneOfClass(cls(n))}">${escape(cleanText(textOf(n)))}</span> `;
  if (n.tag === "ul" || n.tag === "ol") {
    const items = nodes(n).filter((c) => c.tag === "li").map((li) => `<li>${inlineOf(li)}</li>`);
    return `<${n.tag}>${items.join("")}</${n.tag}>`;
  }
  if (n.tag === "p" || n.tag === "div" || n.tag === "label" || /^h[1-6]$/.test(n.tag)) {
    const t = inner().trim();
    return t ? `${t}<br><br>` : "";
  }
  return inner();
}
const tidy = (html: string) =>
  html
    .replace(/\s+/g, " ")
    .replace(/(<br>\s*)+$/g, "")
    .replace(/^(\s*<br>)+/g, "")
    .replace(/(<br>\s*){3,}/g, "<br><br>")
    .trim();

/** Known-palette recolouring for inline SVG charts so they sit in the brand */
const SVG_COLORS: Record<string, string> = {
  "#d9534f": "#0E834B",
  "#e0f1e7": "#CBDFC6",
  "#9aa5b1": "#8A96A3",
  "#cbd5e0": "#D9DEE3",
  "#0e834b": "#0E834B",
  "#0e4d2f": "#0E4D2F",
};
function svgMarkup(n: HNode): string {
  const ser = (x: HChild): string => {
    if (!isNode(x)) return escape(x);
    if (x.tag === "script" || x.tag === "foreignobject") return "";
    const attrs = Object.entries(x.attrs)
      .filter(([k]) => !/^on/i.test(k) && k !== "class" && k !== "style" && k !== "id")
      .map(([k, v]) => {
        const key = { viewbox: "viewBox", preserveaspectratio: "preserveAspectRatio", strokewidth: "stroke-width" }[k] ?? k;
        const val = SVG_COLORS[v.toLowerCase()] ?? v;
        return `${key}="${escape(val)}"`;
      })
      .join(" ");
    const inner = x.children.map(ser).join("");
    return `<${x.tag}${attrs ? " " + attrs : ""}>${inner}</${x.tag}>`;
  };
  return ser(n);
}

function extractTemplated(html: string): ExtractedArticle {
  const root = parseHtml(html);
  const blocks: Block[] = [];
  const productHandles: string[] = [];
  let kicker: string | null = null;
  let pendingKicker: string | null = null;

  const inline = (n: HNode) => tidy(n.children.map((c) => inlineOf(c)).join(""));
  const pushParagraph = (n: HNode) => {
    const h = inline(n);
    if (h && stripHtml(h).trim()) blocks.push({ type: "paragraph", html: h });
  };
  const heading = (n: HNode, level: 2 | 3 | 4) => {
    const text = cleanText(textOf(n));
    if (!text) return;
    const b: Block = { type: "heading", level, text };
    if (level === 2 && pendingKicker) {
      b.kicker = pendingKicker;
      pendingKicker = null;
    }
    blocks.push(b);
  };
  const isCtaLink = (x: HNode) => x.tag === "a" && /button|btn|cta/.test(cls(x));
  const ctaOf = (n: HNode): Cta | undefined => {
    const a = find(n, isCtaLink);
    if (!a?.attrs.href) return undefined;
    return { label: cleanText(textOf(a)), href: rewriteHref(a.attrs.href) };
  };
  const noteProduct = (n: HNode) => {
    for (const a of findAll(n, (x) => x.tag === "a")) {
      const m = (a.attrs.href ?? "").match(/\/products\/([a-z0-9%\-]+)/i);
      if (m) productHandles.push(decodeURIComponent(m[1]));
    }
  };

  const isCard = (n: HNode) =>
    ["div", "article", "section", "li", "a"].includes(n.tag) &&
    (endsWith(n, "-card") || endsWith(n, "-box") || endsWith(n, "-item") || endsWith(n, "-block") || /(^|\s)(card|highlight|panel-card)(\s|$)/.test(cls(n))) &&
    !/(^|\s)(timeline-item|faq-item|selftest-item|product-card|blog-card|season-card|bar-card|flow-card|rhythm-card|chart-card|option-row)(\s|$)/.test(cls(n));
  const isGrid = (n: HNode) => endsWith(n, "-grid") || endsWith(n, "-split") || endsWith(n, "-stack") || /(^|\s)(grid|cards|flow)(\s|$)/.test(cls(n));

  const cardOf = (n: HNode): Card | { stat: { value: string; label: string } } | null => {
    const count = find(n, (x) => /(^|\s)(count|stat-value|stat-number)(\s|$)/.test(cls(x)));
    const label = find(n, (x) => /(^|\s)(label|stat-label)(\s|$)/.test(cls(x)));
    if (count && label) return { stat: { value: cleanText(textOf(count)), label: cleanText(textOf(label)) } };
    const titleNode = find(n, (x) => /^h[2-6]$/.test(x.tag) || endsWith(x, "-title") || x.tag === "summary");
    const title = titleNode ? cleanText(textOf(titleNode)) : "";
    const badge = find(n, (x) => endsWith(x, "-badge") || endsWith(x, "-number") || endsWith(x, "-num") || endsWith(x, "-step"));
    const kickerNode = find(n, (x) => x !== titleNode && (endsWith(x, "-kicker") || endsWith(x, "-eyebrow") || endsWith(x, "-label") || endsWith(x, "-days") || endsWith(x, "-meta")));
    const big = find(n, (x) => /(^|\s)(big-number|card-number)(\s|$)/.test(cls(x)) || endsWith(x, "-value"));
    const note = find(n, (x) => endsWith(x, "-note"));
    const points = find(n, (x) => x.tag === "ul" || x.tag === "ol");
    const figureNode = find(n, (x) => SCALE_CARD.test(cls(x)));
    const figure = figureNode ? scaleOf(figureNode) : null;
    const skip = new Set<HNode>([titleNode, badge, kickerNode, note, points, big, figure ? figureNode : null].filter(Boolean) as HNode[]);
    const bodyParts: string[] = [];
    const collect = (x: HNode) => {
      for (const c of x.children) {
        if (!isNode(c)) {
          if (c.trim()) bodyParts.push(escape(cleanText(c)) + " ");
          continue;
        }
        if (skip.has(c) || DECOR(c)) continue;
        if (c.tag === "div" || c.tag === "section" || c.tag === "article") collect(c);
        else bodyParts.push(inlineOf(c));
      }
    };
    collect(n);
    const body = tidy(bodyParts.join(""));
    if (!title && !body) return null;
    const card: Card = { title, html: body, tone: toneOfClass(cls(n)) };
    if (badge) card.badge = cleanText(textOf(badge));
    if (kickerNode) card.kicker = cleanText(textOf(kickerNode));
    if (big) card.value = cleanText(textOf(big));
    if (points) card.points = nodes(points).filter((li) => li.tag === "li").map((li) => tidy(inlineOf(li)));
    if (note) card.note = inline(note);
    if (figure) card.figure = { ...figure, title: figure.title === title ? null : figure.title };
    return card;
  };

  const pushCards = (cardNodes: HNode[]) => {
    const cards: Card[] = [];
    const stats: { value: string; label: string }[] = [];
    for (const c of cardNodes) {
      noteProduct(c);
      const r = cardOf(c);
      if (!r) continue;
      if ("stat" in r) stats.push(r.stat);
      else cards.push(r);
    }
    if (stats.length) blocks.push({ type: "stats", items: stats });
    if (cards.length) blocks.push({ type: "cards", items: cards });
  };
  const leafCards = (n: HNode) => findAll(n, isCard).filter((x) => !findAll(x, isCard).length);

  const walk = (n: HNode, ctx: { inFaq: boolean }) => {
    const kids = n.children;
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i];
      if (!isNode(c)) {
        if (c.trim()) blocks.push({ type: "paragraph", html: escape(cleanText(c)) });
        continue;
      }
      const tag = c.tag;
      const k = cls(c);
      if (["style", "script", "link", "meta", "button", "form", "input", "nav", "footer", "noscript", "iframe", "svg"].includes(tag)) continue;
      if (tag === "img") {
        const src = c.attrs.src ?? c.attrs["data-src"] ?? "";
        const alt = c.attrs.alt ?? "";
        if (isContentImage(src, alt)) blocks.push({ type: "image", src, alt });
        continue;
      }
      // dbx template (dbx-wrap / dbx-hero family)
      if (/(^|\s)dbx-(wrap|full|full-inner|grid|card|section|container|media|faq)(\s|$)/.test(k)) {
        walk(c, { inFaq: ctx.inFaq || hasClass(c, "dbx-faq") });
        continue;
      }
      if (hasClass(c, "dbx-hero")) {
        const eyebrow = find(c, (x) => hasClass(x, "dbx-eyebrow"));
        if (eyebrow && !kicker) kicker = cleanText(textOf(eyebrow));
        const sub = find(c, (x) => hasClass(x, "dbx-sub"));
        if (sub) pushParagraph(sub);
        continue;
      }
      if (/(^|\s)dbx-(article-stats|cta-row|divider|stat-item)(\s|$)/.test(k)) continue;
      if (/(^|\s)dbx-(info|faktenbox|sticky-tip|quote)(\s|$)/.test(k)) {
        const content = find(c, (x) => hasClass(x, "dbx-info-content")) ?? c;
        const strong = nodes(content).find((x) => x.tag === "strong");
        const title = strong ? cleanText(textOf(strong)) : null;
        const body = tidy(content.children.filter((x) => !(isNode(x) && (x === strong || DECOR(x)))).map((x) => inlineOf(x)).join(""));
        const bullets = body.split(/\s*•\s*/).map((x) => x.trim()).filter(Boolean);
        if (bullets.length >= 2 && body.includes("•")) blocks.push({ type: "cards", items: [{ title: title ?? "", html: "", tone: "info", points: bullets }] });
        else if (body || title) blocks.push({ type: "callout", title, html: body });
        continue;
      }
      if (hasClass(c, "dbx-products") || hasClass(c, "dbx-pcard")) {
        for (const a of findAll(c, (x) => x.tag === "a")) {
          const m = (a.attrs.href ?? "").match(/\/products\/([a-z0-9%\-]+)/i);
          if (m) productHandles.push(decodeURIComponent(m[1]));
        }
        continue;
      }
      if (hasClass(c, "dbx-lead")) {
        pushParagraph(c);
        continue;
      }
      // hero: lead paragraphs + highlight; title and eyebrow come from the article itself
      if (/(^|\s)hero(\s|$)/.test(k) && (tag === "section" || tag === "div")) {
        const eyebrow = find(c, (x) => hasClass(x, "hero-eyebrow"));
        if (eyebrow && !kicker) kicker = cleanText(textOf(eyebrow));
        const textContent = find(c, (x) => hasClass(x, "hero-text-content")) ?? c;
        for (const p of nodes(textContent)) {
          if (p.tag === "p") pushParagraph(p);
          else if (p.tag === "h2" || p.tag === "h3") heading(p, p.tag === "h2" ? 2 : 3);
          else if (hasClass(p, "hero-highlight")) {
            const h4 = find(p, (x) => x.tag === "h4");
            const body = tidy(p.children.filter((x) => !(isNode(x) && x === h4)).map((x) => inlineOf(x)).join(""));
            if (body) blocks.push({ type: "callout", title: h4 ? cleanText(textOf(h4)) : null, html: body });
          } else if (!DECOR(p) && !hasClass(p, "hero-bg") && !hasClass(p, "hero-content")) walk({ tag: "div", attrs: {}, children: [p] }, ctx);
        }
        // some articles never close the hero section, so the whole <main> sits inside it: walk it like top-level content
        for (const inner of findAll(c, (x) => x.tag === "main")) walk(inner, ctx);
        continue;
      }
      // info box / aside: heading, paragraphs and a bullet list → one highlighted card
      if (hasClass(c, "info-box") || (tag === "aside" && !hasClass(c, "faq"))) {
        const titleNode = find(c, (x) => /^h[2-4]$/.test(x.tag));
        const list = find(c, (x) => x.tag === "ul" || x.tag === "ol");
        const body = tidy(
          c.children
            .filter((x) => isNode(x) && x !== titleNode && x !== list && !DECOR(x))
            .map((x) => inlineOf(x))
            .join(""),
        );
        const points = list ? nodes(list).filter((li) => li.tag === "li").map((li) => tidy(inlineOf(li))) : [];
        if (body || points.length) {
          blocks.push({ type: "cards", items: [{ title: titleNode ? cleanText(textOf(titleNode)) : "", html: body, tone: "info", points }] });
          continue;
        }
      }
      if (hasClass(c, "section-eyebrow") || hasClass(c, "fazit-eyebrow")) {
        pendingKicker = cleanText(textOf(c));
        continue;
      }
      if (hasClass(c, "section-subtitle")) {
        const h = inline(c);
        if (h) blocks.push({ type: "subtitle", html: h });
        continue;
      }
      if (hasClass(c, "cta-section") || hasClass(c, "fazit-box")) {
        const titleNode = find(c, (x) => x.tag === "h2" || x.tag === "h3");
        const title = titleNode ? cleanText(textOf(titleNode)) : (pendingKicker ?? "Fazit");
        const textNode = find(c, (x) => hasClass(x, "cta-text")) ?? c;
        const body = tidy(
          textNode.children
            .filter((x) => !(isNode(x) && (x === titleNode || x.tag === "a" || hasClass(x, "fazit-eyebrow") || hasClass(x, "cta-image"))))
            .map((x) => inlineOf(x))
            .join(""),
        );
        noteProduct(c);
        blocks.push({ type: "conclusion", title, html: body, cta: ctaOf(c) });
        pendingKicker = null;
        continue;
      }
      if (/(^|\s)(product-card|product-grid|blog-grid|blog-card|test-card|test-row)(\s|$)/.test(k)) {
        noteProduct(c);
        if (!/product|blog/.test(k)) {
          // test teasers inside the text: keep as a compact card with link
          pushCards([c]);
        }
        continue;
      }
      if (/(^|\s)(cta-strip|sti-cta-row|cta-row)(\s|$)/.test(k)) {
        const p = find(c, (x) => x.tag === "p");
        const body = p ? inline(p) : tidy(c.children.filter((x) => !(isNode(x) && x.tag === "a")).map((x) => inlineOf(x)).join(""));
        noteProduct(c);
        if (body || ctaOf(c)) blocks.push({ type: "callout", title: null, html: body, cta: ctaOf(c) });
        continue;
      }
      // vertical bar chart (season-chart)
      if (/(^|\s)(season-card|season-chart|chart-card)(\s|$)/.test(k)) {
        const chart = hasClass(c, "season-chart") ? c : find(c, (x) => hasClass(x, "season-chart"));
        if (chart) {
          const titleNode = nodes(c).find((x) => /^h[2-6]$/.test(x.tag));
          const cols = nodes(chart).filter((x) => hasClass(x, "season-col"));
          const bars = cols.map((col) => {
            const bar = find(col, (x) => hasClass(x, "season-bar"));
            const label = find(col, (x) => hasClass(x, "season-label"));
            const full = label ? (find(label, (x) => hasClass(x, "full")) ?? label) : null;
            const h = Number((bar?.attrs.style ?? "").match(/height:\s*([\d.]+)%/)?.[1] ?? 0);
            return { label: full ? cleanText(textOf(full)) : "", value: Math.max(0, Math.min(100, h)), high: bar ? /--sun|--high|--good/.test(cls(bar)) : false };
          });
          const nowIdx = cols.findIndex((x) => hasClass(x, "season-col--now") || find(x, (y) => hasClass(y, "season-now")));
          const nowNode = nowIdx >= 0 ? find(cols[nowIdx], (y) => hasClass(y, "season-now")) : null;
          const nowFull = nowNode ? (find(nowNode, (x) => hasClass(x, "full")) ?? nowNode) : null;
          const legend = findAll(c, (x) => endsWith(x, "-legend")).flatMap((l) => nodes(l).map((s) => ({ high: Boolean(find(s, (d) => /--sun|--high|--good/.test(cls(d)))), label: cleanText(textOf(s)) })));
          const noteNode = find(c, (x) => hasClass(x, "chart-note"));
          if (bars.length) {
            blocks.push({ type: "chart", title: titleNode ? cleanText(textOf(titleNode)) : null, bars, marker: nowIdx >= 0 && nowFull ? { index: nowIdx, label: cleanText(textOf(nowFull)) } : undefined, legend, note: noteNode ? inline(noteNode) : null });
            continue;
          }
        }
      }
      // inline SVG figure (e.g. rhythm-card): keep the vector, recoloured, with axis/legend/note
      const svgNode = tag !== "p" && (endsWith(c, "-card") || endsWith(c, "-chart")) ? find(c, (x) => x.tag === "svg") : null;
      if (svgNode) {
        const titleNode = nodes(c).find((x) => /^h[2-6]$/.test(x.tag));
        const axis = findAll(c, (x) => endsWith(x, "-axis")).flatMap((a) => nodes(a).map((s) => ({ label: cleanText(textOf(s)), left: Number((s.attrs.style ?? "").match(/left:\s*([\d.]+)%/)?.[1] ?? 0) })));
        const legend = findAll(c, (x) => endsWith(x, "-legend")).flatMap((l) => nodes(l).map((s) => cleanText(textOf(s))));
        const noteNode = find(c, (x) => hasClass(x, "chart-note"));
        blocks.push({ type: "svg", title: titleNode ? cleanText(textOf(titleNode)) : null, svg: svgMarkup(svgNode), axis, legend, note: noteNode ? inline(noteNode) : null });
        // cards that follow inside the same container
        for (const sub of nodes(c)) if (isGrid(sub)) pushCards(leafCards(sub));
        continue;
      }
      // horizontal bars (bar-card)
      if (hasClass(c, "bar-card")) {
        const items = findAll(c, (x) => hasClass(x, "bar-row")).map((row) => {
          const label = find(row, (x) => hasClass(x, "bar-label"));
          const strong = label ? find(label, (x) => x.tag === "strong" || hasClass(x, "bar-value")) : null;
          const span = label ? find(label, (x) => x.tag === "span") : null;
          const fill = find(row, (x) => hasClass(x, "bar-fill"));
          const pct = Number((fill?.attrs.style ?? "").match(/width:\s*([\d.]+)%/)?.[1] ?? 0);
          return { label: span ? cleanText(textOf(span)) : label ? cleanText(textOf(label)) : "", value: strong ? cleanText(textOf(strong)) : "", pct: Math.max(0, Math.min(100, pct)), tone: fill ? toneOfClass(cls(fill)) : ("default" as CardTone) };
        });
        const noteNode = find(c, (x) => hasClass(x, "chart-note"));
        if (items.length) blocks.push({ type: "bars", items, note: noteNode ? inline(noteNode) : null });
        continue;
      }
      // day strip (day-card): cycle days 1–28 with highlighted days
      if (hasClass(c, "day-card") || hasClass(c, "day-strip")) {
        const strip = hasClass(c, "day-strip") ? c : find(c, (x) => hasClass(x, "day-strip"));
        if (strip) {
          const titleNode = find(c, (x) => /^h[2-4]$/.test(x.tag));
          const cells = nodes(strip).map((x) => ({ label: cleanText(textOf(x)), hl: hasClass(x, "hl") })).filter((x) => x.label);
          const noteNode = find(c, (x) => hasClass(x, "chart-note"));
          if (cells.length >= 3) {
            blocks.push({ type: "days", title: titleNode ? cleanText(textOf(titleNode)) : null, cells, note: noteNode ? inline(noteNode) : null });
            continue;
          }
        }
      }
      // range on a scale (scale-card, length-card, range-bar)
      {
        const sc = scaleOf(c);
        if (sc) {
          blocks.push({ type: "scale", ...sc });
          continue;
        }
      }
      if (hasClass(c, "chart-note")) {
        const h = inline(c);
        if (h) blocks.push({ type: "paragraph", html: `<em>${h}</em>` });
        continue;
      }
      // process flow / timeline → steps (optionally with titles)
      if (/(^|\s)(timeline-card|timeline|flow-card|flow|steps)(\s|$)/.test(k) && !isCard(c)) {
        const titleNode = nodes(c).find((x) => /^h[2-6]$/.test(x.tag));
        const stepNodes = findAll(c, (x) => hasClass(x, "timeline-item") || hasClass(x, "flow-step") || /(^|\s)step(\s|$)/.test(cls(x)));
        const items = stepNodes.map((it) => {
          const body = find(it, (x) => hasClass(x, "timeline-body")) ?? it;
          const t = find(it, (x) => /^h[3-6]$/.test(x.tag));
          const html = tidy(body.children.filter((x) => !(isNode(x) && (x === t || endsWith(x, "-num") || endsWith(x, "-step") || endsWith(x, "-number")))).map((x) => inlineOf(x)).join(""));
          return { title: t ? cleanText(textOf(t)) : undefined, html };
        }).filter((x) => x.title || x.html);
        if (items.length) {
          blocks.push({ type: "steps", title: titleNode ? cleanText(textOf(titleNode)) : null, items });
          continue;
        }
      }
      // FAQ: div.faq > .item | runs of <details> | section#faq with cards (question = title)
      if (tag === "details" || (hasClass(c, "faq") && nodes(c).some((x) => hasClass(x, "item") || x.tag === "details"))) {
        const detailsRun: HNode[] = [];
        if (tag === "details") {
          let j = i;
          while (j < kids.length) {
            const d = kids[j];
            if (isNode(d) && d.tag === "details") detailsRun.push(d);
            else if (isNode(d)) break;
            j++;
          }
          i = j - 1;
        } else detailsRun.push(...nodes(c).filter((x) => hasClass(x, "item") || x.tag === "details"));
        const items = detailsRun
          .map((it) => {
            const q = find(it, (x) => x.tag === "summary" || x.tag === "strong" || /^h[2-6]$/.test(x.tag));
            const a = tidy(it.children.filter((x) => !(isNode(x) && x === q)).map((x) => inlineOf(x)).join(""));
            return q ? { q: cleanText(textOf(q)), a } : null;
          })
          .filter((x): x is { q: string; a: string } => Boolean(x));
        if (items.length) {
          blocks.push({ type: "faq", items });
          continue;
        }
      }
      // standalone pills → chips
      const pillKids = nodes(c).filter((x) => /(^|\s)[a-z-]*pill(\s|$|--)/.test(cls(x)));
      if (pillKids.length >= 2 && pillKids.length === nodes(c).length) {
        blocks.push({ type: "chips", items: pillKids.map((x) => ({ label: cleanText(textOf(x)), tone: toneOfClass(cls(x)) })) });
        continue;
      }
      if (isGrid(c) || (nodes(c).length >= 2 && nodes(c).every((x) => isCard(x) || DECOR(x)))) {
        const cardNodes = leafCards(c);
        if (ctx.inFaq && cardNodes.length) {
          blocks.push({
            type: "faq",
            items: cardNodes
              .map((x) => cardOf(x))
              .filter((r): r is Card => Boolean(r) && !("stat" in (r as object)))
              .map((r) => ({ q: r.title, a: r.html })),
          });
          continue;
        }
        if (cardNodes.length) {
          pushCards(cardNodes);
          continue;
        }
      }
      if (isCard(c)) {
        // a card that wraps several cards (quiz, nested layouts) is really a grid
        const inner = leafCards(c).filter((x) => x !== c);
        if (inner.length >= 2) {
          pushCards(inner);
          continue;
        }
        if (/(^|\s)(highlight|recommendation-box|faq-note|info-box|support-card|quick-check-card)(\s|$)/.test(k) && !inner.length) {
          const r = cardOf(c);
          if (r && !("stat" in r)) {
            const html = [r.html, r.points?.length ? `<ul>${r.points.map((p) => `<li>${p}</li>`).join("")}</ul>` : ""].filter(Boolean).join("<br>");
            blocks.push({ type: "callout", title: r.title || null, html, cta: ctaOf(c) });
            noteProduct(c);
            continue;
          }
        }
        pushCards([c]);
        continue;
      }
      if (tag === "h1") continue;
      if (/^h[2-6]$/.test(tag)) {
        heading(c, Math.min(4, Math.max(2, Number(tag[1]))) as 2 | 3 | 4);
        continue;
      }
      if (tag === "p" || tag === "label") {
        pushParagraph(c);
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = nodes(c).filter((li) => li.tag === "li").map((li) => tidy(inlineOf(li)));
        if (items.length) blocks.push({ type: "list", ordered: tag === "ol", items });
        continue;
      }
      if (tag === "blockquote") {
        const h = inline(c);
        if (h) blocks.push({ type: "quote", html: h });
        continue;
      }
      if (tag === "table") {
        const t = tableBlock(c);
        if (t) blocks.push(t);
        continue;
      }
      if (isCtaLink(c)) {
        const cta = ctaOf(c) ?? (c.attrs.href ? { label: cleanText(textOf(c)), href: rewriteHref(c.attrs.href) } : undefined);
        noteProduct(c);
        if (cta) blocks.push({ type: "callout", title: null, html: "", cta });
        continue;
      }
      if (tag === "a") {
        blocks.push({ type: "paragraph", html: inlineOf(c) });
        continue;
      }
      // structural element → recurse
      const faq = ctx.inFaq || c.attrs.id === "faq" || hasClass(c, "faq-section");
      walk(c, { inFaq: faq });
    }
  };
  walk(root, { inFaq: false });

  // Lead: first paragraph before the first heading
  let lead: string | null = null;
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  const leadIdx = blocks.findIndex((b, i) => b.type === "paragraph" && (firstHeading === -1 || i < firstHeading) && stripHtml(b.html).length > 60);
  if (leadIdx !== -1) {
    lead = decode(stripHtml((blocks[leadIdx] as { html: string }).html));
    blocks.splice(leadIdx, 1);
  }

  // TOC from h2
  const used = new Set<string>();
  const toc: { id: string; text: string }[] = [];
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 2) {
      let id = slugify(b.text) || `abschnitt-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      b.id = id;
      toc.push({ id, text: b.text });
    }
  }

  const textOfBlock = (b: Block): string => {
    switch (b.type) {
      case "heading":
        return b.text;
      case "list":
        return b.items.map(stripHtml).join(" ");
      case "cards":
        return b.items.map((c) => `${c.title} ${stripHtml(c.html)} ${(c.points ?? []).map(stripHtml).join(" ")}`).join(" ");
      case "stats":
        return b.items.map((s) => `${s.value} ${s.label}`).join(" ");
      case "steps":
        return `${b.title ?? ""} ${b.items.map((x) => `${x.title ?? ""} ${stripHtml(x.html)}`).join(" ")}`;
      case "faq":
        return b.items.map((f) => `${f.q} ${stripHtml(f.a)}`).join(" ");
      case "image":
        return "";
      case "chart":
        return `${b.title ?? ""} ${b.bars.map((x) => x.label).join(" ")} ${stripHtml(b.note ?? "")}`;
      case "svg":
        return `${b.title ?? ""} ${b.legend.join(" ")} ${stripHtml(b.note ?? "")}`;
      case "bars":
        return b.items.map((x) => `${x.label} ${x.value}`).join(" ");
      case "table":
        return [...b.head, ...b.rows.flat().map(stripHtml)].join(" ");
      case "chips":
        return b.items.map((x) => x.label).join(" ");
      case "scale":
        return [b.title ?? "", b.band ?? "", ...b.ticks, ...b.labels].join(" ");
      case "days":
        return b.title ?? "";
      default:
        return stripHtml(b.html);
    }
  };
  const words = blocks.map(textOfBlock).join(" ").split(/\s+/).filter(Boolean).length;
  return { kicker, lead, productHandles: Array.from(new Set(productHandles)), blocks, toc, words, readingMinutes: Math.max(1, Math.round(words / 200)) };
}

function tableBlock(tableNode: HNode): Block | null {
  const rows = findAll(tableNode, (x) => x.tag === "tr");
  const head: string[] = [];
  const body: Inline[][] = [];
  for (const tr of rows) {
    const cells = nodes(tr).filter((x) => x.tag === "td" || x.tag === "th");
    if (!cells.length) continue;
    if (cells.every((x) => x.tag === "th") && head.length === 0 && body.length === 0) head.push(...cells.map((x) => cleanText(textOf(x))));
    else body.push(cells.map((x) => tidy(x.children.map((y) => inlineOf(y)).join(""))));
  }
  return body.length ? { type: "table", head, rows: body } : null;
}

/**
 * Classic articles: tables are lifted out before the streaming extractor runs
 * (it would flatten cells into paragraphs) and put back as table blocks.
 */
function extractLegacyWithTables(html: string): ExtractedArticle {
  const tables: Block[] = [];
  const marked = html.replace(/<table[\s\S]*?<\/table>/gi, (seg) => {
    const t = tableBlock(parseHtml(seg));
    if (!t) return "";
    tables.push(t);
    return `<p>__TABLE_${tables.length - 1}__</p>`;
  });
  const out = extractLegacy(marked);
  if (!tables.length) return out;
  out.blocks = out.blocks.map((b) => {
    if (b.type !== "paragraph") return b;
    const m = stripHtml(b.html).trim().match(/^__TABLE_(\d+)__$/);
    return m ? tables[Number(m[1])] : b;
  });
  return out;
}

export function extractArticle(html: string): ExtractedArticle {
  return isTemplated(html) ? extractTemplated(html) : extractLegacyWithTables(html);
}
