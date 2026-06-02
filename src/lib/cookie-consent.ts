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
