"use client";

import {
  Analytics,
  type BeforeSendEvent,
} from "@vercel/analytics/next";
import { useCookieConsent } from "@/components/CookieConsent";
import { hasAnalyticsConsent } from "@/lib/cookie-consent";
import { isPublicSitePath } from "@/lib/analytics";

/** Vercel Web Analytics — loads only after the visitor accepts analytics cookies. */
export function VercelAnalytics() {
  const { hasAnalyticsConsent: consentFromContext } = useCookieConsent();

  if (!consentFromContext || !isPublicSitePath()) {
    return null;
  }

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        if (event.url.includes("/admin") || !hasAnalyticsConsent()) {
          return null;
        }
        return event;
      }}
    />
  );
}
