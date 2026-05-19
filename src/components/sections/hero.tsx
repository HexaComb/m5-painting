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
    <section className="relative overflow-hidden bg-primary pt-16 lg:pt-[4.5rem]">
      {/* Subtle paint texture on the blue */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='18' r='1.2' fill='white'/%3E%3Ccircle cx='48' cy='8' r='0.8' fill='white'/%3E%3Ccircle cx='78' cy='42' r='1' fill='white'/%3E%3Ccircle cx='28' cy='65' r='0.7' fill='white'/%3E%3Ccircle cx='62' cy='75' r='1.3' fill='white'/%3E%3Ccircle cx='8' cy='85' r='0.8' fill='white'/%3E%3Ccircle cx='88' cy='15' r='0.6' fill='white'/%3E%3Ccircle cx='55' cy='52' r='0.9' fill='white'/%3E%3C/svg%3E")`
      }} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 py-16 sm:py-20 md:grid-cols-12 md:items-center md:gap-12 md:py-24 lg:py-28">
          {/* Text — takes 7 columns on desktop for asymmetry */}
          <div className="md:col-span-7 lg:col-span-7">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
                {hero.badgeText}
              </p>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="text-display font-bold text-primary-foreground">
                {hero.headline}
                <br />
                <span className="relative inline-block">
                  {hero.highlightText}
                  <svg
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2 w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M3,8 C30,3 60,7 90,5 C120,3 150,8 180,5 C210,3 240,8 270,5 C285,4 294,7 297,6"
                      stroke="white"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-6 max-w-xl text-body-lg text-primary-foreground/80">
                {hero.bodyText}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#contact" data-track="hero-estimate">
                  <Button
                    size="lg"
                    className="h-auto bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-lg shadow-black/10 hover:bg-white/95"
                  >
                    {hero.ctaText}
                  </Button>
                </a>
                <a href={`tel:${settings.phone.replace(/\D/g, "")}`} data-track="hero-phone">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto border-white/25 bg-transparent px-6 py-3.5 text-base font-semibold text-primary-foreground hover:bg-white/10"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {settings.phone}
                  </Button>
                </a>
              </div>
            </Reveal>

            {/* Trust signals — compact row */}
            <Reveal delay={4}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-primary-foreground/80">
                    5-Star Rated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/lbi-badge.webp"
                    alt="Licensed, Bonded and Insured"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full ring-1 ring-white/20"
                  />
                  <span className="text-sm font-medium text-primary-foreground/80">
                    Licensed, Bonded &amp; Insured
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero image — takes 5 columns, pushed right */}
          <div className="md:col-span-5 lg:col-span-5">
            <Reveal delay={2}>
              <div className="relative mx-auto max-w-sm md:max-w-none">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/25 ring-1 ring-white/10">
                  <Image
                    src="/images/hero-banner.webp"
                    alt="The M5 Painting team at work in the Central Valley"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 90vw, 40vw"
                  />
                </div>
                {/* Offset background shape */}
                <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl bg-white/8" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
