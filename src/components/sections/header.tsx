"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/content-types";

const navLinks = [
  { label: "Services", href: "#services", track: "nav-services" },
  { label: "Our Work", href: "#projects", track: "nav-work" },
  { label: "About", href: "#about", track: "nav-about" },
  { label: "Reviews", href: "#reviews", track: "nav-reviews" },
];

export function Header({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const querySettings = useQuery(api.content.getSiteSettings);
  const settings = querySettings === undefined ? initialSettings : querySettings;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!settings) return null;

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ease-out ${
        scrolled
          ? "border-white/10 bg-brand-black/95 shadow-lg shadow-black/50 backdrop-blur-md"
          : "border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-6 lg:h-[4.75rem]">
        <a href="#" className="flex shrink-0 items-center" aria-label={settings.businessName}>
          <Image
            src="/images/logo.webp"
            alt={settings.businessName}
            width={1024}
            height={1024}
            className="h-11 w-auto sm:h-[3.25rem]"
            priority
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-track={link.track}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                scrolled
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
                scrolled
                  ? "text-on-dark-secondary hover:bg-white/10 hover:text-on-dark"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              {settings.phone}
            </Button>
          </a>
          <a href="#contact" data-track="header-estimate">
            <Button
              size="sm"
              className="brand-gradient-blue min-h-11 border-0 px-4 font-bold text-white shadow-md brand-glow hover:opacity-95 md:min-h-9"
            >
              Free Estimate
            </Button>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`ml-1 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50 md:hidden ${
              scrolled ? "text-on-dark-secondary hover:text-on-dark" : "text-white/90 hover:text-white"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-brand-black px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-track={link.track}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-on-dark-secondary transition-colors hover:bg-white/10 hover:text-on-dark"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${settings.phone.replace(/\D/g, "")}`}
              data-track="header-phone"
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-brand-electric"
            >
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
