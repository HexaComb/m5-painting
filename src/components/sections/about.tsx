"use client";

import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  DEFAULT_ABOUT_IMAGES,
  type AboutContent,
  type AboutImage,
  type AboutValue,
} from "@/lib/content-types";
import { AboutImageCarousel } from "@/components/sections/about-image-carousel";

export function About({
  initialAbout,
  initialImages,
  initialValues,
}: {
  initialAbout?: AboutContent | null;
  initialImages?: AboutImage[] | null;
  initialValues?: AboutValue[] | null;
}) {
  const queryAbout = useQuery(api.content.getAboutContent);
  const queryImages = useQuery(api.content.getAboutImages);
  const queryValues = useQuery(api.content.getAboutValues);
  const about = queryAbout === undefined ? initialAbout : queryAbout;
  const images =
    queryImages === undefined
      ? (initialImages ?? DEFAULT_ABOUT_IMAGES)
      : queryImages.length > 0
        ? queryImages
        : DEFAULT_ABOUT_IMAGES;
  const values = queryValues === undefined ? initialValues : queryValues;
  if (!about || !values) return null;

  return (
    <section id="about" className="brand-surface-dark relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-24 h-56 w-[min(70vw,420px)] brand-swoosh"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <AboutImageCarousel images={images} />
            </Reveal>
          </div>

          <div className="space-y-10 lg:col-span-7">
            <Reveal>
              <div>
                <p className="text-label text-brand-electric">{about.subtitle}</p>
                <h2 className="mt-2 text-headline font-bold text-on-dark">
                  {about.title}
                </h2>
                <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="space-y-4">
                {about.paragraphs.map((p, i) => (
                  <p key={i} className="text-body-lg text-on-dark-secondary">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <div className="divide-y divide-white/10">
              {values.map((value, idx) => (
                <Reveal
                  key={value._id}
                  delay={Math.min(idx + 1, 4) as 0 | 1 | 2 | 3 | 4}
                  className="py-5"
                >
                  <div className="flex gap-5">
                    <span
                      aria-hidden="true"
                      className="shrink-0 pt-px text-[0.65rem] font-bold leading-none tracking-[0.15em] text-brand-electric/80"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-on-dark">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-on-dark-secondary">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
