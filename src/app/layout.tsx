import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CookieConsentProvider } from "@/components/CookieConsent";
import { Tracker } from "@/components/Tracker";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { ConvexClientProvider } from "@/components/admin/ConvexClientProvider";
import type { SiteContent } from "@/lib/content-types";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

let _buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json not yet generated (e.g. next dev without prebuild)
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://m5painting.com";

const metaDescription =
  _buildContent?.siteSettings?.metaDescription ??
  "M5 Painting is a family-owned painting contractor in the Central Valley, California. Interior, exterior, and commercial painting. Contact us for a free estimate.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "M5 Painting | Residential & Commercial Painting in Central Valley, CA",
  description: metaDescription,
  applicationName: "M5 Painting",
  icons: {
    icon: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  keywords: [
    "painting contractor",
    "residential painting",
    "commercial painting",
    "interior painting",
    "exterior painting",
    "house painter",
    "Central Valley",
    "California",
    "Sanger",
    "Fresno",
    "Clovis",
    "M5 Painting",
    "free estimate",
  ],
  openGraph: {
    title: "M5 Painting | Residential & Commercial Painting",
    description: metaDescription,
    type: "website",
    url: "/",
    siteName: "M5 Painting",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "M5 Painting crew at work — family-owned painting contractor in Central Valley, CA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M5 Painting | Residential & Commercial Painting",
    description: metaDescription,
    images: ["/images/hero-banner.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${lato.variable} font-sans antialiased`}>
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
