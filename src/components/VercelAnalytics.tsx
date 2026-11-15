"use client";

import { usePathname } from "next/navigation";
import {
  Analytics,
  type BeforeSendEvent,
} from "@vercel/analytics/next";
import { isPublicSitePath } from "@/lib/analytics";

/** Vercel Web Analytics loads on public site paths only. */
export function VercelAnalytics() {
  const pathname = usePathname();
  if (!isPublicSitePath(pathname)) {
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
