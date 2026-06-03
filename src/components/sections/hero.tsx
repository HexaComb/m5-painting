"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Phone, Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { HeroMedia } from "@/components/sections/hero-media";
import type { HeroContent, HeroMediaType, SiteSettings } from "@/lib/content-types";
import {
  DEFAULT_HERO_MEDIA_ALT,
  DEFAULT_HERO_MEDIA_TYPE,
  DEFAULT_HERO_VIDEO,
} from "@/lib/content-types";

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
  const heroMediaSrc = hero.mediaUrl ?? DEFAULT_HERO_VIDEO;
  const heroMediaType: HeroMediaType =
    hero.mediaUrl !== undefined
      ? (hero.mediaType ?? "image")
      : DEFAULT_HERO_MEDIA_TYPE;
  const heroMediaAlt = hero.mediaAlt ?? DEFAULT_HERO_MEDIA_ALT;
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

      {/* Mountain silhouette — bottom ridge only; soft mask instead of color overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 sm:h-32 md:h-36"
      >
        <Image
          src="/images/hero-banner.webp"
          alt=""
          fill
          className="object-cover object-bottom opacity-50 [mask-image:linear-gradient(to_top,black_70%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_70%,transparent)]"
          priority
          sizes="100vw"
        />
      </div>

      <span className="sr-only">
        M5 Painting serves the Central Valley with residential and commercial painting
      </span>

      <div className="relative z-[2] mx-auto max-w-6xl px-5 pb-24 sm:px-6 sm:pb-28 md:pb-32">
        <div className="py-14 sm:py-20 md:py-24 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="text-display font-extrabold text-white">
                  {hero.headline}
                  <br />
                  <span className="relative inline-block text-brand-electric">
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

              <Reveal delay={1}>
                <p className="mt-6 text-body-lg text-on-dark-secondary">
                  {hero.bodyText}
                </p>
              </Reveal>

              <Reveal delay={2}>
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
            </div>

            <Reveal delay={1} className="lg:col-span-5 lg:row-span-2 lg:row-start-1 lg:col-start-8">
              <div className="relative mx-auto max-w-md lg:max-w-none lg:ml-auto">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-4 rounded-3xl bg-brand-electric/15 blur-2xl"
                />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-brand-navy/15 ring-1 ring-white/10">
                  <HeroMedia
                    src={heroMediaSrc}
                    type={heroMediaType}
                    alt={heroMediaAlt}
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                  />
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal delay={3}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 lg:mt-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="chrome-star h-3.5 w-3.5"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-on-dark-secondary">
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
                    <span className="text-sm font-semibold text-on-dark-secondary">
                      Licensed, Bonded &amp; Insured
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
