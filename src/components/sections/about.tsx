"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  DEFAULT_ABOUT_IMAGE,
  DEFAULT_ABOUT_IMAGE_ALT,
  type AboutContent,
  type AboutImage,
  type AboutValue,
} from "@/lib/content-types";

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
  const images = queryImages === undefined ? initialImages : queryImages;
  const values = queryValues === undefined ? initialValues : queryValues;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fallbackImage = {
    _id: "default",
    _creationTime: 0,
    order: 0,
    imageUrl: about?.imageUrl ?? DEFAULT_ABOUT_IMAGE,
    imageAlt: about?.imageAlt ?? DEFAULT_ABOUT_IMAGE_ALT,
  };
  const galleryImages = images && images.length > 0 ? images : [fallbackImage];
  const hasMultipleImages = galleryImages.length > 1;

  useEffect(() => {
    setActiveImageIndex((current) =>
      Math.min(current, Math.max(galleryImages.length - 1, 0)),
    );
  }, [galleryImages.length]);

  if (!about || !values) return null;

  const showPreviousImage = () => {
    setActiveImageIndex(
      (current) => (current - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  };

  return (
    <section id="about" className="m5-section m5-about">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-24 h-56 w-[min(70vw,420px)] brand-swoosh"
      />
      <div className="m5-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          {/* Image column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="m5-about-photo">
                  {galleryImages.map((image, index) => (
                    <Image
                      key={image._id}
                      src={image.imageUrl}
                      alt={image.imageAlt}
                      fill
                      className={`object-cover transition-opacity duration-700 ${
                        index === activeImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                      sizes="(max-width: 1024px) 384px, 480px"
                      quality={70}
                      loading="lazy"
                    />
                  ))}
                  {hasMultipleImages && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/85 text-brand-navy shadow-md hover:bg-white"
                        aria-label="Show previous about image"
                        onClick={showPreviousImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/85 text-brand-navy shadow-md hover:bg-white"
                        aria-label="Show next about image"
                        onClick={showNextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {galleryImages.map((image, index) => (
                          <button
                            key={image._id}
                            type="button"
                            className={`h-2 rounded-full transition-all ${
                              index === activeImageIndex
                                ? "w-6 bg-white"
                                : "w-2 bg-white/60"
                            }`}
                            aria-label={`Show about image ${index + 1}`}
                            onClick={() => setActiveImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content column */}
          <div className="space-y-10 lg:col-span-7">
            <Reveal>
              <div>
                <p className="text-label text-brand-electric">
                  {about.subtitle}
                </p>
                <h2 className="m5-about-title">{about.title}</h2>
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

            {/* Values use a quiet craft mark, never decorative numbering. */}
            <div className="divide-y divide-white/10">
              {values.map((value, idx) => (
                <Reveal
                  key={value._id}
                  delay={Math.min(idx + 1, 4) as 0 | 1 | 2 | 3 | 4}
                  className="py-5"
                >
                  <div className="flex gap-5">
                    <Check
                      className="mt-1 shrink-0 text-brand-electric"
                      size={16}
                      aria-hidden="true"
                    />
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
