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
 * Lightweight client-side tracker.
 *
 * 1. Fetches active event configs from the Convex `/api/events` endpoint
 * 2. Finds matching DOM elements via `data-track` attributes
 * 3. Attaches listeners and fires analytics events on trigger
 *
 * Dispatches to:
 *   - GA4 (gtag)
 *   - Meta Pixel (fbq)
 *   - Custom `track` event on window (for any future provider)
 */
export function Tracker() {
  useEffect(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return;

    // Derive the HTTP API base from the Convex deployment URL
    // e.g. https://next-snail-279.convex.cloud → same base
    const apiBase = convexUrl.replace(/\/$/, "");

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
