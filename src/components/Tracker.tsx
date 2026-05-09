"use client";

import { useEffect } from "react";

interface TrackingEvent {
  name: string;
  category: string;
  label: string;
  targetElement: string;
  trigger: "click" | "form_submit";
}

// Declare global types for analytics providers
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Generate a random session ID (persisted per browser session).
 */
function getSessionId(): string {
  const key = "__m5_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Lightweight client-side tracker.
 *
 * 1. Fetches active event configs from the Convex `/api/events` endpoint
 * 2. Finds matching DOM elements via `data-track` attributes
 * 3. Attaches listeners and fires analytics events on trigger
 * 4. Logs each hit back to Convex `/api/events/log` for the analytics dashboard
 *
 * Dispatches to:
 *   - GA4 (gtag)
 *   - Meta Pixel (fbq)
 *   - Custom `track` event on window (for any future provider)
 */
export function Tracker() {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
    if (!siteUrl) return;

    const apiBase = siteUrl.replace(/\/$/, "");

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
              // GA4 / gtag
              if (window.gtag) {
                window.gtag("event", event.name, {
                  event_category: event.category,
                  event_label: event.label,
                });
              }

              // Meta Pixel
              if (window.fbq) {
                window.fbq("trackCustom", event.name, {
                  category: event.category,
                  label: event.label,
                });
              }

              // dataLayer (GTM)
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: event.name,
                  event_category: event.category,
                  event_label: event.label,
                });
              }

              // Custom DOM event for any listener
              window.dispatchEvent(
                new CustomEvent("track", {
                  detail: {
                    name: event.name,
                    category: event.category,
                    label: event.label,
                    targetElement: event.targetElement,
                  },
                }),
              );

              // Log hit to Convex analytics (fire-and-forget)
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
                // Silently fail — tracking should never break the site
              });
            };

            el.addEventListener(eventType, handler);
            cleanups.push(() => el.removeEventListener(eventType, handler));
          }
        }
      } catch {
        // Silently fail — tracking should never break the site
      }
    }

    // Wait a tick for the DOM to settle after hydration
    const timer = setTimeout(init, 100);

    return () => {
      aborted = true;
      clearTimeout(timer);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
