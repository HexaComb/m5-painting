"use client";

import Image from "next/image";
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
  return (
    <>
      <section className="m5-hero" aria-labelledby="hero-title">
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
        <div className="m5-hero-visual">
          {hero.mediaUrl ? (
            <HeroMedia
              src={hero.mediaUrl}
              type={hero.mediaType ?? "image"}
              alt={hero.mediaAlt ?? "M5 Painting project"}
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          ) : (
            <Image
              src="/images/project-door.webp"
              alt="Freshly painted entry, siding, and white trim from an M5 Painting project"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
              className="m5-hero-image"
            />
          )}
          <div className="m5-photo-note">
            <span>THE DETAILS MAKE THE DIFFERENCE</span>
            <p>
              A fresh welcome.
              <br />A lasting impression.
            </p>
          </div>
          <a
            href="#projects"
            className="m5-photo-link"
            aria-label="Explore M5 Painting projects"
          >
            <ArrowUpRight size={25} aria-hidden="true" />
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
            .slice(0, 2)
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
