"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const navLinks = [
  { label: "Services", href: "#services", track: "nav-services" },
  { label: "Our Work", href: "#projects", track: "nav-work" },
  { label: "About", href: "#about", track: "nav-about" },
  { label: "Reviews", href: "#reviews", track: "nav-reviews" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = useQuery(api.content.getSiteSettings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!settings) return null;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:h-[4.5rem]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.webp"
            alt={settings.businessName}
            width={48}
            height={48}
            className="h-9 w-auto sm:h-11"
            priority
          />
          <span className="hidden text-lg font-bold tracking-tight text-foreground font-heading sm:inline-block">
            {settings.businessName}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-track={link.track}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a href={`tel:${settings.phone.replace(/\D/g, "")}`} data-track="header-phone" className="hidden lg:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              {settings.phone}
            </Button>
          </a>
          <a href="#contact" data-track="header-estimate">
            <Button size="sm" className="font-semibold shadow-md shadow-primary/20">
              Free Estimate
            </Button>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-track={link.track}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${settings.phone.replace(/\D/g, "")}`}
              data-track="header-phone"
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary"
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
