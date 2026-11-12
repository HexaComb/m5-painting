"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const headerRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const live = useQuery(api.content.getSiteSettings);
  const settings = live === undefined ? initialSettings : live;

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 960px)");
    const reset = () => {
      if (breakpoint.matches) setMobileOpen(false);
    };
    breakpoint.addEventListener("change", reset);
    return () => breakpoint.removeEventListener("change", reset);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (!settings) return null;
  const phoneHref = `tel:${settings.phone.replace(/\D/g, "")}`;

  return (
    <header
      ref={headerRef}
      className="m5-site-header"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setMobileOpen(false);
        }
      }}
    >
      <div className="m5-container m5-nav-inner">
        <Link
          href="/"
          aria-label={`${settings.businessName} home`}
          className="m5-nav-brand"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/images/logo.webp"
            alt={settings.businessName}
            width={1024}
            height={1024}
            sizes="(max-width: 959px) 64px, 72px"
            className="m5-nav-logo"
            priority
          />
        </Link>
        <nav className="m5-desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-track={link.track}
              className="m5-nav-link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="m5-nav-actions">
          <Link
            href="/contact"
            data-track="header-estimate"
            className="m5-nav-cta"
            aria-label="Get a free estimate"
            onClick={() => setMobileOpen(false)}
          >
            <span className="m5-estimate-label">Free estimate</span>
            <span className="m5-estimate-short" aria-hidden="true">Estimate</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="m5-menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div
        id="mobile-navigation"
        hidden={!mobileOpen}
        className="m5-mobile-panel"
      >
        <div className="m5-container m5-mobile-inner">
          <nav className="m5-mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-track={link.track}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              aria-current={pathname === "/contact" ? "page" : undefined}
            >
              Contact
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </nav>
          <a
            href={phoneHref}
            data-track="header-phone"
            className="m5-mobile-call"
            onClick={() => setMobileOpen(false)}
          >
            <Phone size={17} aria-hidden="true" />
            <span>Let’s talk about your project<strong>{settings.phone}</strong></span>
          </a>
        </div>
      </div>
    </header>
  );
}
