"use client";

import { useEffect } from "react";
import { useCookieConsent } from "@/components/CookieConsent";
import {
  dispatchAnalyticsEvent,
  getConvexSiteUrl,
  getSessionId,
  isPublicSitePath,
  logAnalyticsHit,
} from "@/lib/analytics";

interface TrackingEvent {
  name: string;
  category: string;
  label: string;
  targetElement: string;
  trigger: "click" | "form_submit";
}

/**
 * Fetches active event configs from Convex and attaches listeners to
 * matching `data-track` elements on the public site.
 */
export function Tracker() {
  const { hasAnalyticsConsent } = useCookieConsent();

  useEffect(() => {
    if (!hasAnalyticsConsent || !isPublicSitePath()) return;

    const apiBase = getConvexSiteUrl();
    if (!apiBase) return;

    let aborted = false;
    const cleanups: (() => void)[] = [];

    async function init() {
      try {
        const res = await fetch(`${apiBase}/api/events`, {
          cache: "no-store",
        });
        if (!res.ok || aborted) return;

        const data = (await res.json()) as { events: TrackingEvent[] };
        if (aborted || !data.events?.length) return;

        const sessionId = getSessionId();

        for (const event of data.events) {
          const elements = document.querySelectorAll(
            `[data-track="${event.targetElement}"]`,
          );

          for (const el of elements) {
            const eventType =
              event.trigger === "form_submit" ? "submit" : "click";

            const handler = () => {
              dispatchAnalyticsEvent(event);
              logAnalyticsHit(event, sessionId);
            };

            el.addEventListener(eventType, handler);
            cleanups.push(() => el.removeEventListener(eventType, handler));
          }
        }
      } catch {
        // Tracking should never break the site
      }
    }

    const timer = setTimeout(init, 100);

    return () => {
      aborted = true;
      clearTimeout(timer);
      cleanups.forEach((fn) => fn());
    };
  }, [hasAnalyticsConsent]);

  return null;
}
