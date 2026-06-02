"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useCookieConsent } from "@/components/CookieConsent";
import { isPublicSitePath, trackPageView } from "@/lib/analytics";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Loads third-party analytics scripts and records a page view for the public site.
 * Scripts load only after the visitor accepts analytics cookies.
 *
 * Configure one of:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID (direct GA4)
 * - NEXT_PUBLIC_GTM_ID (Google Tag Manager — configure GA4 inside GTM)
 * - NEXT_PUBLIC_META_PIXEL_ID (Meta Pixel)
 */
export function Analytics() {
  const { hasAnalyticsConsent } = useCookieConsent();

  useEffect(() => {
    if (!hasAnalyticsConsent || !isPublicSitePath()) return;
    trackPageView();
  }, [hasAnalyticsConsent]);

  if (!hasAnalyticsConsent || !isPublicSitePath()) {
    return null;
  }

  return (
    <>
      {gtmId ? (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      ) : null}

      {gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });
            `}
          </Script>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
        </>
      ) : null}

      {gaMeasurementId && !gtmId ? (
        <>
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                send_page_view: false
              });
            `}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            window.fbq = fbq;
          `}
        </Script>
      ) : null}
    </>
  );
}
