import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import { Tracker } from "@/components/Tracker";
import { ConvexClientProvider } from "@/components/admin/ConvexClientProvider";
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

export const metadata: Metadata = {
  title: "M5 Painting | Residential & Commercial Painting in Central Valley, CA",
  description:
    "M5 Painting is a family-owned painting business in Central Valley, California. Expert residential and commercial painting services — interior, exterior, and more. Contact us for a free estimate.",
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
      <body className={`${montserrat.variable} ${lato.variable} font-sans antialiased`}>
        <ConvexClientProvider>
          {children}
          <Tracker />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
