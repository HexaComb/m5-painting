import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M5 Painting | Residential & Commercial Painting in Central Valley, CA",
  description:
    "M5 Painting is a family-owned painting business in Central Valley, California. Expert residential and commercial painting services — interior, exterior, and more. Call 559-451-1022 for a free estimate.",
  keywords: [
    "painting",
    "residential painting",
    "commercial painting",
    "interior painting",
    "exterior painting",
    "Central Valley",
    "California",
    "Sanger",
    "Fresno",
    "house painting",
    "M5 Painting",
  ],
  openGraph: {
    title: "M5 Painting | Residential & Commercial Painting",
    description:
      "Family-owned painting business bringing fresh, vibrant transformations to your space. Serving Central Valley, CA.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
