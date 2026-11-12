"use client";

import {
  Analytics,
  type BeforeSendEvent,
} from "@vercel/analytics/next";
import { isPublicSitePath } from "@/lib/analytics";

/** Vercel Web Analytics loads on public site paths only. */
export function VercelAnalytics() {
  if (!isPublicSitePath()) {
    return null;
  }

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        if (event.url.includes("/admin")) {
          return null;
        }
        return event;
      }}
    />
  );
}
