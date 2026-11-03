/**
 * Locks page scrolling while a drawer, panel or sheet is open. iOS Safari ignores overflow:hidden on
 * <body> for touch scrolling, so the body is pinned with position:fixed at the current offset and
 * scrolled back on unlock. Counted, so two overlays (e.g. Mira over the menu) don't unlock each other.
 */
let locks = 0;
let saved: { y: number; style: string; path: string } | null = null;

export function lockScroll(): () => void {
  if (locks++ === 0) {
    const y = window.scrollY;
    // keep the space of the vanishing scrollbar so the page doesn't jump sideways
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const body = document.body;
    saved = { y, style: body.getAttribute("style") ?? "", path: location.pathname + location.search };
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, left: "0", right: "0", overflow: "hidden" });
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks > 0 || !saved) return;
    const { y, style, path } = saved;
    saved = null;
    if (style) document.body.setAttribute("style", style);
    else document.body.removeAttribute("style");
    // closed by a link to another page: that page starts at the top, not at the old offset.
    // html has scroll-behavior: smooth; jumping back must be instant
    window.scrollTo({ top: location.pathname + location.search === path ? y : 0, behavior: "instant" });
  };
}
