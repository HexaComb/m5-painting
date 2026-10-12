import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { CookieConsentProvider } from "@/components/CookieConsent";
import { Tracker } from "@/components/Tracker";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { ConvexClientProvider } from "@/components/admin/ConvexClientProvider";
import { cookieConsentBootScript } from "@/lib/cookie-consent";
import type { SiteContent } from "@/lib/content-types";
import {
  BUSINESS_NAME,
  DEFAULT_META_DESCRIPTION,
  PRIMARY_KEYWORDS,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const bootScripts = `${cookieConsentBootScript}(function(){var l=document.createElement("link");l.rel="stylesheet";l.href="/fonts.css";l.media="print";l.onload=function(){this.media="all"};document.head.appendChild(l)})();`;

let _buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json not yet generated (e.g. next dev without prebuild)
}

const metaDescription =
  _buildContent?.siteSettings?.metaDescription ?? DEFAULT_META_DESCRIPTION;

const defaultTitle =
  "Sanger Painters | Residential & Commercial | M5 Painting";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: metaDescription,
  applicationName: BUSINESS_NAME,
  icons: {
    icon: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  keywords: [...PRIMARY_KEYWORDS],
  authors: [{ name: BUSINESS_NAME, url: SITE_URL }],
  creator: BUSINESS_NAME,
  publisher: BUSINESS_NAME,
  category: "Home & Construction",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: metaDescription,
    type: "website",
    url: "/",
    siteName: BUSINESS_NAME,
    locale: "en_US",
    images: [
      {
        url: "/images/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "Sanger painters from M5 Painting — residential and commercial painting in the Central Valley, California",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: metaDescription,
    images: ["/images/hero-banner.webp"],
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "Sanger",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          id="cookie-consent-boot"
          dangerouslySetInnerHTML={{ __html: bootScripts }}
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-cookie-banner]{display:none!important}",
            }}
          />
          {/* Brand fonts for no-JS. JS path injects this stylesheet asynchronously. */}
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/fonts.css" />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          <CookieConsentProvider>
            {children}
            <VercelAnalytics />
            <Analytics />
            <Tracker />
          </CookieConsentProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
