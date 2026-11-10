"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/content-types";

const links = [
  { label: "Services", href: "/services", track: "nav-services" },
  { label: "Our Work", href: "/#projects", track: "nav-work" },
  { label: "Our Story", href: "/#about", track: "nav-about" },
  { label: "Reviews", href: "/#reviews", track: "nav-reviews" },
];

export function Header({
  initialSettings,
}: {
  initialSettings?: SiteSettings | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const live = useQuery(api.content.getSiteSettings);
  const settings = live === undefined ? initialSettings : live;

  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 768px)");
    const reset = () => {
      if (breakpoint.matches) setMobileOpen(false);
    };
    breakpoint.addEventListener("change", reset);
    return () => breakpoint.removeEventListener("change", reset);
  }, []);

  if (!settings) return null;
  return (
    <header className="m5-site-header fixed top-0 z-50 w-full border-b">
      <div className="m5-container flex h-[5rem] items-center justify-between lg:h-[6rem]">
        <Link
          href="/"
          aria-label={`${settings.businessName} home`}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={1024}
            height={1024}
            sizes="(min-width: 640px) 80px, 64px"
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            priority
          />
          <span className="m5-wordmark" aria-hidden="true">
            M5 PAINTING<small>RESIDENTIAL &amp; COMMERCIAL</small>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-track={link.track}
              className="px-3 py-3 text-xs font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${settings.phone.replace(/\D/g, "")}`}
            data-track="header-phone"
            className="hidden items-center gap-2 text-xs text-white xl:flex"
          >
            <Phone size={14} aria-hidden="true" />
            {settings.phone}
          </a>
          <Link
            href="/contact"
            data-track="header-estimate"
            className="m5-nav-cta inline-flex items-center justify-center gap-3"
          >
            Free Estimate <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div
        id="mobile-navigation"
        hidden={!mobileOpen}
        className="border-t border-white/15 bg-[#0d1824] md:hidden"
      >
        <nav
          className="m5-container flex flex-col gap-1 py-5"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-track={link.track}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-base font-medium text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="py-3 text-base font-medium text-white"
          >
            Contact
          </Link>
          <a
            href={`tel:${settings.phone.replace(/\D/g, "")}`}
            data-track="header-phone"
            className="flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-blue-200"
          >
            <Phone size={16} aria-hidden="true" />
            {settings.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
