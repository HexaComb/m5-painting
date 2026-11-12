import { hasAnalyticsConsent } from "@/lib/cookie-consent";

export interface AnalyticsEvent {
  name: string;
  category: string;
  label: string;
  targetElement: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const SESSION_KEY = "__m5_session";

export function getConvexSiteUrl(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (siteUrl) return siteUrl.replace(/\/$/, "");

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return null;

  return convexUrl.replace(/\/$/, "").replace(".convex.cloud", ".convex.site");
}

export function isPublicSitePath(pathname = window.location.pathname): boolean {
  return !pathname.startsWith("/admin");
}

export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type GenerateLeadParams = {
  form: string;
  interest: string;
};

/**
 * Deliver a GA4 event through exactly one integration path.
 *
 * Direct GA4 uses gtag. GTM uses dataLayer and requires a GA4 Event tag in
 * the container for these events. Consent is checked again if we need to
 * defer delivery until the direct tag has finished initializing.
 *
 * Never include names, emails, phone numbers, messages or query strings.
 */
function sendGoogleAnalyticsEvent(
  eventName: "generate_lead" | "click_to_call",
  parameters: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent() || !isPublicSitePath()) return;

  if (process.env.NEXT_PUBLIC_GTM_ID) {
    window.dataLayer ??= [];
    window.dataLayer.push({ event: eventName, ...parameters });
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
    return;
  }

  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    const onReady = () => {
      if (hasAnalyticsConsent() && isPublicSitePath()) {
        window.gtag?.("event", eventName, parameters);
      }
    };
    window.addEventListener("m5-ga-ready", onReady, { once: true });
  }
}

/**
 * A lead is only counted after the site has successfully accepted it.
 * Never send form field values or personal information to GA4.
 */
export function trackGenerateLead(params: GenerateLeadParams): void {
  sendGoogleAnalyticsEvent("generate_lead", {
    form_name: params.form,
    lead_type: params.interest,
  });
}

/**
 * Measures a click-to-call intention, NOT a confirmed or connected call.
 * Any tel: link can be tracked with the same event regardless of location.
 */
export function trackClickToCall(
  clickLocation: "header" | "footer" | "contact" | "page",
): void {
  sendGoogleAnalyticsEvent("click_to_call", {
    click_location: clickLocation,
    page_path: window.location.pathname,
  });
}

export function dispatchAnalyticsEvent(event: AnalyticsEvent): void {
  if (!hasAnalyticsConsent()) return;

  if (window.gtag) {
    window.gtag("event", event.name, {
      event_category: event.category,
      event_label: event.label,
    });
  }

  if (window.fbq) {
    window.fbq("trackCustom", event.name, {
      category: event.category,
      label: event.label,
    });
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: event.name,
      event_category: event.category,
      event_label: event.label,
    });
  }

  window.dispatchEvent(
    new CustomEvent("track", {
      detail: event,
    }),
  );
}

export function logAnalyticsHit(
  event: AnalyticsEvent,
  sessionId = getSessionId(),
): void {
  if (!hasAnalyticsConsent()) return;

  const apiBase = getConvexSiteUrl();
  if (!apiBase || !isPublicSitePath()) return;

  fetch(`${apiBase}/api/events/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName: event.name,
      category: event.category,
      label: event.label,
      targetElement: event.targetElement,
      url: window.location.href,
      sessionId,
    }),
  }).catch(() => {
    // Tracking should never break the site
  });
}

export function trackPageView(sessionId = getSessionId()): void {
  if (!isPublicSitePath() || !hasAnalyticsConsent()) return;

  const event: AnalyticsEvent = {
    name: "page_view",
    category: "engagement",
    label: document.title || "Page View",
    targetElement: "page",
  };

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.hash,
    });
  }

  if (window.fbq) {
    window.fbq("track", "PageView");
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.hash,
    });
  }

  logAnalyticsHit(event, sessionId);
}
