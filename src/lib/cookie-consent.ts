export const COOKIE_CONSENT_STORAGE_KEY = "m5_cookie_consent";

export type CookieConsentChoice = "accepted" | "rejected";

export function getStoredCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    // Private browsing or blocked storage
  }

  return null;
}

export function setStoredCookieConsent(choice: CookieConsentChoice): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ignore — banner will show again on next visit
  }
}

export function hasAnalyticsConsent(): boolean {
  return getStoredCookieConsent() === "accepted";
}

/** HTML attribute used to hide the SSR'd banner before paint when a choice already exists. */
export const COOKIE_CONSENT_HTML_ATTR = "data-cookie-consent";

/**
 * Blocking boot snippet: reads the same localStorage key/values as getStoredCookieConsent
 * and stamps the choice on <html> so returning visitors never flash the banner (and so
 * a late client mount is not required for first-time visitors).
 */
export const cookieConsentBootScript = `(function(){try{var v=localStorage.getItem("${COOKIE_CONSENT_STORAGE_KEY}");if(v==="accepted"||v==="rejected")document.documentElement.setAttribute("${COOKIE_CONSENT_HTML_ATTR}",v)}catch(e){}})();`;

export function applyCookieConsentHtmlAttr(
  choice: CookieConsentChoice | null,
): void {
  if (typeof document === "undefined") return;
  if (choice === "accepted" || choice === "rejected") {
    document.documentElement.setAttribute(COOKIE_CONSENT_HTML_ATTR, choice);
  } else {
    document.documentElement.removeAttribute(COOKIE_CONSENT_HTML_ATTR);
  }
}
