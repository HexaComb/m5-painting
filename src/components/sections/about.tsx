"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { AboutContent, AboutValue } from "@/lib/content-types";

export function About({
  initialAbout,
  initialValues,
}: {
  initialAbout?: AboutContent | null;
  initialValues?: AboutValue[] | null;
}) {
  const queryAbout = useQuery(api.content.getAboutContent);
  const queryValues = useQuery(api.content.getAboutValues);
  const about = queryAbout === undefined ? initialAbout : queryAbout;
  const values = queryValues === undefined ? initialValues : queryValues;
  if (!about || !values) return null;

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          {/* Image column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-brand-navy/15">
                  <Image
                    src="/images/team-collage.webp"
                    alt="Matt and the M5 Painting crew on a job site"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content column */}
          <div className="space-y-10 lg:col-span-7">
            <Reveal>
              <div>
                <p className="text-label-light">{about.subtitle}</p>
                <h2 className="mt-2 text-headline font-bold text-foreground">
                  {about.title}
                </h2>
                <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="space-y-4">
                {about.paragraphs.map((p, i) => (
                  <p key={i} className="text-body-lg text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Values — numbered list with rule separators */}
            <div className="divide-y divide-border">
              {values.map((value, idx) => (
                <Reveal
                  key={value._id}
                  delay={Math.min(idx + 1, 4) as 0 | 1 | 2 | 3 | 4}
                  className="py-5"
                >
                  <div className="flex gap-5">
                    <span
                      aria-hidden="true"
                      className="shrink-0 pt-px text-[0.65rem] font-bold leading-none tracking-[0.15em] text-brand-blue/60"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
