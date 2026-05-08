import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.webp"
                alt="M5 Painting"
                width={36}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
              <div>
                <p className="text-base font-bold font-heading">M5 Painting</p>
                <p className="text-xs text-primary-foreground/50">
                  Family-Owned Since Day One
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              Bringing color, care, and craftsmanship to homes and businesses
              across the Central Valley.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-foreground/40">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-foreground/40">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Phone className="h-4 w-4 shrink-0" />
                Phone coming soon
              </div>
              <div className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Mail className="h-4 w-4 shrink-0" />
                Email coming soon
              </div>
              <div className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 shrink-0" />
                Sanger, CA · Central Valley
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-foreground/40">
              Credentials
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Image
                  src="/images/lbi-badge.webp"
                  alt="Licensed, Bonded and Insured"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 rounded-full"
                />
                <span>Licensed, Bonded &amp; Insured</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Image
                  src="/images/quality-badge.webp"
                  alt="Premium Quality"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 rounded-full"
                />
                <span>5-Star Rated on Yelp &amp; Angi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} M5 Painting. All Rights Reserved.
          </p>
          <p className="text-xs text-primary-foreground/30">
            Proudly serving Sanger, Fresno, Clovis &amp; the Central Valley
          </p>
        </div>
      </div>
    </footer>
  );
}
