/**
 * Tiny HTML → tree parser for the article extractor. Tolerant: unknown or
 * mis-nested closing tags are ignored, void tags never open a scope.
 */
export type HNode = { tag: string; attrs: Record<string, string>; children: HChild[] };
export type HChild = HNode | string;

const VOID = new Set(["br", "img", "hr", "input", "link", "meta", "source", "wbr", "col", "embed", "track", "area", "base"]);
const RAW = new Set(["style", "script"]);

export const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

function parseAttrs(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  return out;
}

export function parseHtml(html: string): HNode {
  const root: HNode = { tag: "#root", attrs: {}, children: [] };
  const stack: HNode[] = [root];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][a-zA-Z0-9]*)\s*>|<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|([^<]+)|(<)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    const top = stack[stack.length - 1];
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const idx = stack.map((n) => n.tag).lastIndexOf(tag);
      if (idx > 0) stack.length = idx; // pop to (and including) the matching element
      continue;
    }
    if (m[2]) {
      const tag = m[2].toLowerCase();
      const node: HNode = { tag, attrs: parseAttrs(m[3] ?? ""), children: [] };
      top.children.push(node);
      if (RAW.has(tag)) {
        // swallow raw text until the closing tag
        const close = html.indexOf(`</${tag}`, re.lastIndex);
        if (close !== -1) re.lastIndex = close;
        continue;
      }
      if (!m[4] && !VOID.has(tag)) stack.push(node);
      continue;
    }
    const text = m[5] ?? m[6];
    if (text) top.children.push(decodeEntities(text));
  }
  return root;
}

export const isNode = (c: HChild): c is HNode => typeof c !== "string";
export const classes = (n: HNode): string[] => (n.attrs.class ?? "").split(/\s+/).filter(Boolean);
export const hasClass = (n: HNode, c: string): boolean => classes(n).some((x) => x === c || x.startsWith(`${c}--`));
export const nodes = (n: HNode): HNode[] => n.children.filter(isNode);

/** Plain text of a subtree, whitespace collapsed */
export function textOf(n: HChild): string {
  if (!isNode(n)) return n;
  if (n.tag === "br") return " ";
  if (["style", "script", "svg", "img"].includes(n.tag)) return "";
  return n.children.map(textOf).join("");
}
export const cleanText = (s: string) => s.replace(/\s+/g, " ").trim();

export function find(n: HNode, pred: (x: HNode) => boolean): HNode | null {
  for (const c of nodes(n)) {
    if (pred(c)) return c;
    const d = find(c, pred);
    if (d) return d;
  }
  return null;
}
export function findAll(n: HNode, pred: (x: HNode) => boolean, out: HNode[] = []): HNode[] {
  for (const c of nodes(n)) {
    if (pred(c)) out.push(c);
    findAll(c, pred, out);
  }
  return out;
}
