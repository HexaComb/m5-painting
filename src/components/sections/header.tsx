"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/images/logo.webp"
            alt="M5 Painting"
            width={48}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
          <span className="hidden text-lg font-bold tracking-tight text-foreground sm:inline-block">
            M5 Painting
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a href="tel:5594511022" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm">
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              559-451-1022
            </Button>
          </a>
          <a href="#contact">
            <Button size="sm">Get a Free Estimate</Button>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:5594511022"
              className="mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-primary"
            >
              <Phone className="h-4 w-4" />
              559-451-1022
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
