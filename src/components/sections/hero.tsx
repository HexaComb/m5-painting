"use client";

import { ArrowDown, ArrowUpRight, Check, Phone } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type {
  HeroContent,
  SiteSettings,
  Certification,
} from "@/lib/content-types";
import { defaultCertifications } from "@/lib/default-content";
import { HeroMedia } from "./hero-media";
import {
  DEFAULT_HERO_VIDEO,
  DEFAULT_HERO_VIDEO_ALT,
} from "@/lib/content-types";

export function Hero({
  initialHero,
  initialSettings,
  initialCertifications,
}: {
  initialHero?: HeroContent | null;
  initialSettings?: SiteSettings | null;
  initialCertifications?: Certification[] | null;
}) {
  const liveHero = useQuery(api.content.getHeroContent);
  const liveSettings = useQuery(api.content.getSiteSettings);
  const liveCertifications = useQuery(api.content.getCertifications);
  const hero = liveHero === undefined ? initialHero : liveHero;
  const settings = liveSettings === undefined ? initialSettings : liveSettings;
  const certifications =
    liveCertifications === undefined
      ? (initialCertifications ?? defaultCertifications)
      : liveCertifications;
  if (!hero || !settings) return null;
  // Keep the full process video available in the CMS; use its caption-free
  // jobsite excerpt for the homepage background.
  const useDefaultMedia = !hero.mediaUrl || hero.mediaUrl === DEFAULT_HERO_VIDEO;
  const mediaSrc = useDefaultMedia
    ? "/videos/m5-hero-background.mp4"
    : hero.mediaUrl!;
  const mediaType = useDefaultMedia ? "video" : (hero.mediaType ?? "image");
  return (
    <>
      <section className="m5-hero" aria-labelledby="hero-title">
        <HeroMedia
          src={mediaSrc}
          type={mediaType}
          alt={hero.mediaAlt ?? DEFAULT_HERO_VIDEO_ALT}
          poster={useDefaultMedia ? "/images/hero-video-poster.webp" : undefined}
          priority
          sizes="100vw"
          className="m5-hero-background"
        />
        <div className="m5-hero-copy">
          <p className="m5-eyebrow">
            <span className="m5-status-dot" /> Sanger roots. Central Valley
            pride.
          </p>
          <h1 id="hero-title">
            {hero.headline}
            <br />
            <span>{hero.highlightText}</span>
          </h1>
          <p className="m5-hero-description">{hero.bodyText}</p>
          <div className="m5-actions">
            <a className="m5-button" href="#contact" data-track="hero-estimate">
              {hero.ctaText}
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
            <a
              className="m5-phone"
              href={`tel:${settings.phone.replace(/\D/g, "")}`}
              data-track="hero-phone"
            >
              <Phone size={17} aria-hidden="true" />
              {settings.phone}
            </a>
          </div>
          <a className="m5-explore" href="#projects">
            <span>
              <ArrowDown size={18} aria-hidden="true" />
            </span>{" "}
            A closer look at our work
          </a>
        </div>
      </section>
      <div className="m5-trust-band">
        <div className="m5-container">
          <span className="m5-trust-intro">Good people. Great care.</span>
          <span>
            <Check size={16} aria-hidden="true" /> Family-owned &amp; local
          </span>
          {certifications
            .filter((c) => c.showInHero && c.enabled !== false)
            .map((c) => (
              <span key={c._id}>
                <Check size={16} aria-hidden="true" />
                {c.label}
              </span>
            ))}
        </div>
      </div>
    </>
  );
}
