import WIDTHS from "./image-widths.json";

/**
 * next/image loader without on-server optimisation (sharp/AVIF filled the 512 MB container and hung the app):
 *  - Shopify images are resized by the Shopify CDN, which also serves WebP
 *  - local photos in public/ are pre-sized at build time by scripts/build-images.mjs → /_img/<path>-<width>.webp
 */
const SHOPIFY_FILES = "https://cdn.shopify.com/s/files/1/0564/6991/3683/";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (src.startsWith("/")) {
    const local = src.match(/^\/(.+)\.(jpe?g|png)$/i);
    if (!local) return src;
    const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
    return `/_img/${local[1]}-${w}.webp`;
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  // Same files as the Shopify CDN; the custom domain moves to this app at go-live
  if (url.hostname === "shop.doctorbox.de" && url.pathname.startsWith("/cdn/shop/")) {
    const search = url.search;
    url = new URL(SHOPIFY_FILES + url.pathname.slice("/cdn/shop/".length));
    url.search = search;
  }
  if (url.hostname !== "cdn.shopify.com") return src;
  url.searchParams.set("width", String(width));
  return url.toString();
}
