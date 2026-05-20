"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Phone, Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { HeroContent, SiteSettings } from "@/lib/content-types";

export function Hero({
  initialHero,
  initialSettings,
}: {
  initialHero?: HeroContent | null;
  initialSettings?: SiteSettings | null;
}) {
  const queryHero = useQuery(api.content.getHeroContent);
  const querySettings = useQuery(api.content.getSiteSettings);
  const hero = queryHero === undefined ? initialHero : queryHero;
  const settings = querySettings === undefined ? initialSettings : querySettings;
  if (!hero || !settings) return null;
  return (
    <section className="brand-surface-dark relative overflow-hidden pt-[4.25rem] lg:pt-[4.75rem]">
      {/* Electric glow — echoes logo swoosh */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/4 h-72 w-[min(90vw,520px)] brand-swoosh"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-48 w-80 rounded-full bg-brand-electric/20 blur-3xl"
      />

      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='18' r='1.2' fill='white'/%3E%3Ccircle cx='48' cy='8' r='0.8' fill='white'/%3E%3Ccircle cx='78' cy='42' r='1' fill='white'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mountain silhouette — crop to the bottom edge of the branded asset only (no logo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 overflow-hidden sm:h-28 md:h-32"
      >
        <div className="absolute bottom-0 left-0 right-0 aspect-[2292/4302] w-full">
          <Image
            src="/images/hero-banner.webp"
            alt=""
            fill
            className="object-cover object-bottom opacity-70"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy from-25% via-brand-navy/80 via-70% to-transparent" />
      </div>

      <span className="sr-only">
        M5 Painting serves the Central Valley with residential and commercial painting
      </span>

      <div className="relative z-[2] mx-auto max-w-6xl px-5 pb-24 sm:px-6 sm:pb-28 md:pb-32">
        <div className="py-14 sm:py-20 md:py-24 lg:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-label mb-4 inline-flex items-center gap-2 rounded-full border border-brand-electric/30 bg-brand-electric/10 px-4 py-1.5 text-brand-chrome">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-electric shadow-[0_0_8px_var(--brand-electric)]" />
                {hero.badgeText}
              </p>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="text-display font-extrabold text-white">
                {hero.headline}
                <br />
                <span className="relative inline-block bg-gradient-to-r from-white via-brand-chrome to-brand-electric bg-clip-text text-transparent">
                  {hero.highlightText}
                  <svg
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2 w-full lg:left-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3,8 C30,3 60,7 90,5 C120,3 150,8 180,5 C210,3 240,8 270,5 C285,4 294,7 297,6"
                      stroke="url(#hero-underline)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />
                    <defs>
                      <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="oklch(0.64 0.16 248)" />
                        <stop offset="100%" stopColor="oklch(0.92 0.01 262)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-6 text-body-lg text-brand-chrome/90">
                {hero.bodyText}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#contact" data-track="hero-estimate">
                  <Button
                    size="lg"
                    className="brand-gradient-blue h-auto border-0 px-7 py-3.5 text-base font-bold text-white brand-glow hover:opacity-95"
                  >
                    {hero.ctaText}
                  </Button>
                </a>
                <a href={`tel:${settings.phone.replace(/\D/g, "")}`} data-track="hero-phone">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto border-brand-chrome/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:border-brand-electric/50 hover:bg-white/10"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {settings.phone}
                  </Button>
                </a>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-brand-chrome">
                    5-Star Rated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/lbi-badge.webp"
                    alt="Licensed, Bonded and Insured"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full ring-1 ring-brand-electric/30"
                  />
                  <span className="text-sm font-semibold text-brand-chrome">
                    Licensed, Bonded &amp; Insured
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
