"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/content-types";

const navLinks = [
  { label: "Services", href: "/#services", track: "nav-services" },
  { label: "Our Work", href: "/#projects", track: "nav-work" },
  { label: "About", href: "/#about", track: "nav-about" },
  { label: "Reviews", href: "/#reviews", track: "nav-reviews" },
  { label: "Contact", href: "/contact", track: "nav-contact" },
];

export function Header({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const querySettings = useQuery(api.content.getSiteSettings);
  const settings = querySettings === undefined ? initialSettings : querySettings;
  const isHeaderSolid = scrolled || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  if (!settings) return null;

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ease-out ${
        isHeaderSolid
          ? "border-white/10 bg-brand-black/95 shadow-lg shadow-black/50 backdrop-blur-md"
          : "border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex h-[4.75rem] max-w-6xl items-center justify-between px-5 sm:px-6 lg:h-[5.25rem]">
        <Link href="/" className="flex shrink-0 items-center" aria-label={settings.businessName}>
          <Image
            src="/images/logo.webp"
            alt={settings.businessName}
            width={1024}
            height={1024}
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-track={link.track}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                isHeaderSolid
                  ? "text-on-dark-secondary hover:text-on-dark"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${settings.phone.replace(/\D/g, "")}`} data-track="header-phone" className="hidden lg:inline-flex">
            <Button
              variant="ghost"
              size="sm"
              className={`font-medium transition-colors duration-300 ${
                isHeaderSolid
                  ? "text-on-dark-secondary hover:bg-white/10 hover:text-on-dark"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              {settings.phone}
            </Button>
          </a>
          <Link href="/contact" data-track="header-estimate">
            <Button
              size="sm"
              className="brand-gradient-blue min-h-11 border-0 px-4 font-bold text-white shadow-md brand-glow hover:opacity-95 md:min-h-9"
            >
              Free Estimate
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`ml-1 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50 md:hidden ${
              isHeaderSolid ? "text-on-dark-secondary hover:text-on-dark" : "text-white/90 hover:text-white"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`grid overflow-hidden border-t border-white/10 bg-brand-black/98 transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-5 pt-3 sm:px-6" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-track={link.track}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-bold text-on-dark-secondary transition-colors hover:bg-white/10 hover:text-on-dark focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50"
              >
                {link.label}
              </a>
            ))}
            <Link href="/contact" data-track="header-estimate" onClick={() => setMobileOpen(false)} className="mt-3">
              <Button className="brand-gradient-blue min-h-12 w-full border-0 font-bold text-white shadow-md brand-glow hover:opacity-95">
                Free Estimate
              </Button>
            </Link>
            <a
              href={`tel:${settings.phone.replace(/\D/g, "")}`}
              data-track="header-phone"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-brand-electric transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50"
            >
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
