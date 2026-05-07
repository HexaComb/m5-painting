import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.webp"
                alt="M5 Painting"
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <p className="text-base font-bold">M5 Painting</p>
                <p className="text-xs text-background/60">
                  Family-Owned Since Day One
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              A Central Valley family bringing color, care, and craftsmanship
              to homes and businesses across Sanger, Fresno, Clovis, and beyond.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-background/50">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-background/50">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="tel:5594511022"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <Phone className="h-4 w-4 shrink-0" />
                559-451-1022
              </a>
              <a
                href="mailto:m5paintingco@gmail.com"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <Mail className="h-4 w-4 shrink-0" />
                m5paintingco@gmail.com
              </a>
              <div className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0" />
                Sanger, CA · Central Valley
              </div>
            </div>
          </div>

          {/* Licenses */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-background/50">
              Credentials
            </h4>
            <div className="space-y-2 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/lbi-badge.webp"
                  alt="Licensed, Bonded and Insured"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                />
                <span>Licensed, Bonded &amp; Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/quality-badge.webp"
                  alt="Premium Quality"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                />
                <span>5-Star Rated on Yelp &amp; Angi</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} M5 Painting. All Rights Reserved.
          </p>
          <p className="text-xs text-background/40">
            Proudly serving Sanger, Fresno, Clovis &amp; the Central Valley
          </p>
        </div>
      </div>
    </footer>
  );
}
