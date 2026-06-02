"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  type CookieConsentChoice,
  getStoredCookieConsent,
  setStoredCookieConsent,
} from "@/lib/cookie-consent";

type ConsentState = CookieConsentChoice | "pending" | null;

interface CookieConsentContextValue {
  consent: ConsentState;
  hasAnalyticsConsent: boolean;
  accept: () => void;
  reject: () => void;
  openPreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

function CookieBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-navy p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="space-y-2 text-on-dark sm:max-w-2xl">
          <p id="cookie-banner-title" className="text-sm font-semibold text-white">
            Cookies &amp; analytics
          </p>
          <p
            id="cookie-banner-description"
            className="text-sm leading-relaxed text-on-dark-secondary"
          >
            We use cookies and similar technologies to understand how visitors use
            our site (including Vercel Web Analytics and Google Analytics) and to
            measure marketing performance. You can accept analytics cookies or
            continue with only essential cookies.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/20 bg-transparent text-on-dark hover:bg-white/10 hover:text-white"
            onClick={onReject}
          >
            Essential only
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-brand-electric text-brand-navy hover:bg-brand-electric/90"
            onClick={onAccept}
          >
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicSite = !pathname.startsWith("/admin");

  const [consent, setConsent] = useState<ConsentState>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = getStoredCookieConsent();
    setConsent(stored ?? "pending");
    setShowBanner(stored === null);
  }, []);

  const persist = useCallback((choice: CookieConsentChoice) => {
    setStoredCookieConsent(choice);
    setConsent(choice);
    setShowBanner(false);
    window.dispatchEvent(
      new CustomEvent("cookie-consent-changed", { detail: { choice } }),
    );
  }, []);

  const accept = useCallback(() => persist("accepted"), [persist]);
  const reject = useCallback(() => persist("rejected"), [persist]);
  const openPreferences = useCallback(() => setShowBanner(true), []);

  const value = useMemo(
    () => ({
      consent,
      hasAnalyticsConsent: consent === "accepted",
      accept,
      reject,
      openPreferences,
    }),
    [consent, accept, reject, openPreferences],
  );

  const bannerVisible =
    isPublicSite && showBanner && (consent === "pending" || consent === null);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {bannerVisible ? (
        <CookieBanner onAccept={accept} onReject={reject} />
      ) : null}
    </CookieConsentContext.Provider>
  );
}
