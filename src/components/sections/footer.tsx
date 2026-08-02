"use client";

import Image from "next/image";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCookieConsent } from "@/components/CookieConsent";
import { FooterCertifications, filterFooterCertifications } from "@/components/sections/certifications";
import type { SiteSettings, Certification } from "@/lib/content-types";
import { defaultCertifications } from "@/lib/default-content";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Our Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

const serviceLinks = [
  { label: "Residential Painting", href: "/residential-painting" },
  { label: "Commercial Painting", href: "/commercial-painting" },
  { label: "Interior Painting", href: "/interior-painting" },
  { label: "Exterior Painting", href: "/exterior-painting" },
  { label: "Sanger Painting Company", href: "/sanger-painting-company" },
  {
    label: "Central Valley Painting",
    href: "/central-valley-painting-company",
  },
];

export function Footer({
  initialSettings,
  initialCertifications,
}: {
  initialSettings?: SiteSettings | null;
  initialCertifications?: Certification[] | null;
}) {
  const querySettings = useQuery(api.content.getSiteSettings);
  const queryCertifications = useQuery(api.content.getCertifications);
  const settings = querySettings === undefined ? initialSettings : querySettings;
  const certifications =
    queryCertifications === undefined
      ? (initialCertifications ?? defaultCertifications)
      : queryCertifications.length > 0
        ? queryCertifications
        : defaultCertifications;
  const { openPreferences } = useCookieConsent();
  if (!settings) return null;
  const footerCerts = filterFooterCertifications(certifications);
  const phoneHref = settings.phone.replace(/\D/g, "");
  const [primaryLocation = settings.address, serviceArea] = settings.address
    .split("·")
    .map((part) => part.trim());
  const [addressLocality = primaryLocation, addressRegion = "CA"] = primaryLocation
    .split(",")
    .map((part) => part.trim());
  return (
    <footer className="brand-surface-dark border-t border-white/10 text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo.webp"
              alt={settings.businessName}
              width={1024}
              height={1024}
              className="h-20 w-20 object-contain"
            />
            <p className="text-label text-brand-electric">{settings.tagline}</p>
            <p className="max-w-xs text-sm leading-relaxed text-on-dark-secondary">
              Bringing color, care, and craftsmanship to homes and businesses
              across the Central Valley.
            </p>
          </div>

          <div>
            <h4 className="text-label mb-4 text-on-dark-muted">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-on-dark-secondary transition-colors hover:text-on-dark"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-label mb-4 text-on-dark-muted">Painting Services</h4>
            <nav className="flex flex-col gap-2.5" aria-label="Service pages">
              {serviceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-on-dark-secondary transition-colors hover:text-on-dark"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-label mb-4 text-on-dark-muted">Name, Address, Phone</h4>
            <address
              className="space-y-3 not-italic"
              itemScope
              itemType="https://schema.org/LocalBusiness"
            >
              <div className="flex items-center gap-2.5 text-sm text-on-dark-secondary">
                <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                <span itemProp="name" className="font-semibold text-on-dark">
                  {settings.businessName}
                </span>
              </div>
              <a
                href={`tel:${phoneHref}`}
                className="flex items-center gap-2.5 text-sm text-on-dark-secondary transition-colors hover:text-brand-electric"
                itemProp="telephone"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 text-sm text-on-dark-secondary transition-colors hover:text-brand-electric"
                itemProp="email"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {settings.email}
              </a>
              <div
                className="flex items-center gap-2.5 text-sm text-on-dark-secondary"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <span itemProp="addressLocality">{addressLocality}</span>,{" "}
                  <span itemProp="addressRegion">{addressRegion}</span>
                  {serviceArea ? (
                    <span className="text-on-dark-muted"> · {serviceArea}</span>
                  ) : null}
                </span>
              </div>
            </address>
          </div>

          {footerCerts.length > 0 && (
            <div>
              <h4 className="text-label mb-4 text-on-dark-muted">Credentials</h4>
              <FooterCertifications certifications={certifications} />
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-on-dark-muted">
            &copy; {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={openPreferences}
              className="text-xs text-on-dark-muted underline-offset-2 transition-colors hover:text-on-dark-secondary hover:underline"
            >
              Cookie preferences
            </button>
            <p className="text-xs text-on-dark-muted">
              Proudly serving {settings.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
