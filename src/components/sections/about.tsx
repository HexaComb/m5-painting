"use client";

import Image from "next/image";
import { Heart, Handshake, Shield, Palette } from "lucide-react";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const iconMap = {
  Heart,
  Handshake,
  Shield,
  Palette,
} as const;

type IconName = keyof typeof iconMap;

export function About() {
  const about = useQuery(api.content.getAboutContent);
  const values = useQuery(api.content.getAboutValues);
  if (!about || !values) return null;
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          {/* Image column — 5 cols, sticky on scroll */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-primary/10">
                  <Image
                    src="/images/team-collage.webp"
                    alt="Matt and the M5 Painting crew on a job site"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                </div>
                {/* Blue accent bar at bottom */}
                <div className="absolute -bottom-2 left-4 right-4 h-2 rounded-full bg-primary/30" />
              </div>
            </Reveal>
          </div>

          {/* Content column — 7 cols */}
          <div className="space-y-10 lg:col-span-7">
            <Reveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {about.subtitle}
                </p>
                <h2 className="mt-2 text-headline font-bold text-foreground">
                  {about.title}
                </h2>
                <BrushStroke color="var(--primary)" className="mt-3" />
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

            {/* Values — 2x2 grid with left border accent */}
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value, idx) => {
                const Icon = iconMap[value.iconName as IconName] ?? Heart;
                return (
                  <Reveal key={value._id} delay={Math.min(idx + 1, 4) as 0 | 1 | 2 | 3 | 4}>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
