"use client";

import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/content-types";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Footer({
  initialSettings,
}: {
  initialSettings?: SiteSettings | null;
}) {
  const querySettings = useQuery(api.content.getSiteSettings);
  const settings = querySettings === undefined ? initialSettings : querySettings;
  if (!settings) return null;
  return (
    <footer className="brand-surface-dark border-t border-white/10 text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo.webp"
              alt={settings.businessName}
              width={1024}
              height={1024}
              className="h-14 w-auto max-w-[220px]"
            />
            <p className="text-label text-brand-electric/90">{settings.tagline}</p>
            <p className="max-w-xs text-sm leading-relaxed text-brand-chrome/80">
              Bringing color, care, and craftsmanship to homes and businesses
              across the Central Valley.
            </p>
          </div>

          <div>
            <h4 className="text-label mb-4 text-brand-chrome/50">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-chrome/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-label mb-4 text-brand-chrome/50">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href={`tel:${settings.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2.5 text-sm text-brand-chrome/80 transition-colors hover:text-brand-electric"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 text-sm text-brand-chrome/80 transition-colors hover:text-brand-electric"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {settings.email}
              </a>
              <div className="flex items-center gap-2.5 text-sm text-brand-chrome/80">
                <MapPin className="h-4 w-4 shrink-0" />
                {settings.address}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-label mb-4 text-brand-chrome/50">Credentials</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-brand-chrome/80">
                <Image
                  src="/images/lbi-badge.webp"
                  alt="Licensed, Bonded and Insured"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 rounded-full ring-1 ring-brand-electric/30"
                />
                <span>Licensed, Bonded &amp; Insured</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-brand-chrome/80">
                <Image
                  src="/images/quality-badge.webp"
                  alt="Premium Quality"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 rounded-full ring-1 ring-brand-electric/30"
                />
                <span>5-Star Rated on Yelp &amp; Angi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-brand-chrome/50">
            &copy; {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.
          </p>
          <p className="text-xs text-brand-chrome/40">
            Proudly serving {settings.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
