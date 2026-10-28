/**
 * Turns a product metafield into HTML for the product page: rich_text fields
 * arrive as Shopify's JSON document, multi-line text as plain text with line
 * breaks, single-line/HTML fields are passed through.
 */
type RichNode = {
  type: string;
  value?: string;
  level?: number;
  bold?: boolean;
  italic?: boolean;
  url?: string;
  listType?: "ordered" | "unordered";
  children?: RichNode[];
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderRich(n: RichNode): string {
  const kids = () => (n.children ?? []).map(renderRich).join("");
  switch (n.type) {
    case "root":
      return kids();
    case "heading":
      return `<h${Math.min(Math.max(n.level ?? 3, 2), 4)}>${kids()}</h${Math.min(Math.max(n.level ?? 3, 2), 4)}>`;
    case "paragraph":
      return `<p>${kids()}</p>`;
    case "list":
      return n.listType === "ordered" ? `<ol>${kids()}</ol>` : `<ul>${kids()}</ul>`;
    case "list-item":
      return `<li>${kids()}</li>`;
    case "link":
      return `<a href="${esc(n.url ?? "#")}">${kids()}</a>`;
    case "text": {
      let t = esc(n.value ?? "").replace(/\n/g, "<br>");
      if (n.bold) t = `<strong>${t}</strong>`;
      if (n.italic) t = `<em>${t}</em>`;
      return t;
    }
    default:
      return kids();
  }
}

export function metafieldToHtml(field: { type: string; value: string } | null | undefined): string | null {
  if (!field?.value?.trim()) return null;
  const { type, value } = field;
  if (type === "rich_text_field") {
    try {
      return renderRich(JSON.parse(value) as RichNode);
    } catch {
      return null;
    }
  }
  if (/^<[a-z]/i.test(value.trim())) return value; // already HTML
  // plain / multi-line text: blank line = paragraph, line break = <br>
  return value
    .trim()
    .split(/\n\s*\n/)
    .map((para) => `<p>${esc(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Bullet points from a metafield: text lists, line-separated text or rich-text list items */
export function metafieldToLines(field: { type: string; value: string } | null | undefined): string[] {
  if (!field?.value?.trim()) return [];
  const { type, value } = field;
  if (type.startsWith("list.")) {
    try {
      const arr = JSON.parse(value) as unknown;
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      /* fall through */
    }
  }
  if (type === "rich_text_field") {
    const html = metafieldToHtml(field) ?? "";
    return html
      .split(/<\/(?:li|p|h[2-4])>/)
      .map((s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim())
      .filter(Boolean);
  }
  return value
    .split(/\n|<br\s*\/?>/i)
    .map((s) => s.replace(/<[^>]+>/g, "").replace(/^[\s•✓✔\-–*]+/, "").trim())
    .filter(Boolean);
}
