// Dumps the extracted blocks of blog articles: npx tsx scripts/debug-blocks.ts <articles.json> <handle...>
import { readFileSync } from "node:fs";
import { extractArticle } from "@/lib/content/article-render";
const arts = JSON.parse(readFileSync(process.argv[2], "utf8")).data.articles.nodes as { handle: string; contentHtml: string }[];
for (const h of process.argv.slice(3)) {
  const a = arts.find((x) => x.handle === h);
  if (!a) { console.log("not found", h); continue; }
  const ex = extractArticle(a.contentHtml);
  console.log(`### ${h}  lead=${(ex.lead ?? "").slice(0, 60)}`);
  for (const b of ex.blocks) {
    const t = b as Record<string, unknown>;
    const items = t.items as { title?: string; q?: string; label?: string }[] | undefined;
    const text = (t.text ?? t.html ?? t.title ?? (items ? items.map((i) => i.title ?? i.q ?? i.label ?? String(i)).join(" | ") : "")) as string;
    console.log(`  ${b.type.padEnd(10)} ${String(text).replace(/<[^>]+>/g, "").slice(0, 100)}`);
  }
}
