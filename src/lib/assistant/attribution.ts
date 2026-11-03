/**
 * Purchases that came through Mira: products the visitor opened from one of her recommendations are
 * remembered for the tab (sessionStorage), and adding one of them to the cart marks the cart line.
 * Shopify copies the line attribute into the order, where a Shopify Flow workflow tags the order "Mira".
 * Mira only answers after the visitor's consent, so nothing is stored without it.
 */
const KEY = "mira-picks";

/** Leading underscore: Shopify hides the attribute from the customer in cart, checkout and e-mails */
export const MIRA_LINE_ATTRIBUTE = { key: "_mira", value: "empfohlen" };

function read(): string[] {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function rememberMiraPick(handle: string) {
  try {
    const picks = read().filter((h) => h !== handle);
    sessionStorage.setItem(KEY, JSON.stringify([...picks, handle].slice(-20)));
  } catch {
    // storage blocked: the purchase simply isn't attributed
  }
}

export const isMiraPick = (handle: string) => read().includes(handle);
