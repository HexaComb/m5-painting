"use client";

import {
  Paintbrush,
  Home,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const iconMap = {
  Home,
  Paintbrush,
  Building2,
  MessageSquare,
} as const;

type IconName = keyof typeof iconMap;

export function Services() {
  const services = useQuery(api.content.getServices);
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section header — left-aligned, not centered */}
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How We Can Help
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              What We Do
            </h2>
            <BrushStroke color="var(--primary)" className="mt-3" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              From a fresh coat in the living room to a full exterior
              makeover, we bring your vision to life.
            </p>
          </div>
        </Reveal>

        {/* Services — alternating layout, not uniform cards */}
        <div className="space-y-6">
          {/* Top row: two wide services — blue cards matching commercial */}
          <div className="grid gap-6 lg:grid-cols-2">
            {services && services.slice(0, 2).map((service, idx) => {
              const Icon = iconMap[service.iconName as IconName] ?? Home;
              return (
                <Reveal key={service._id} delay={idx + 1} className="h-full">
                  <div className="group relative flex h-full flex-col rounded-2xl bg-primary p-7 text-primary-foreground transition-colors hover:bg-primary/90 sm:p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-title font-bold">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mb-6 max-w-lg text-[0.95rem] leading-relaxed text-primary-foreground/80">
                      {service.description}
                    </p>
                    <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-2">
                      {service.items.map((item) => (
                        <p
                          key={item}
                          className="flex items-center gap-2 text-sm text-primary-foreground/85"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-white/60" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Bottom row: one wide + one narrow — different rhythm */}
          {services && services.length >= 4 && services[2] && services[3] && (
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Commercial — takes 3 columns */}
              <Reveal delay={1} className="lg:col-span-3">
                <div className="group relative h-full rounded-2xl bg-primary p-7 text-primary-foreground sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-title font-bold">
                      {services[2].title}
                    </h3>
                  </div>
                  <p className="mb-6 max-w-lg text-[0.95rem] leading-relaxed text-primary-foreground/80">
                    {services[2].description}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                    {services[2].items.map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 text-sm text-primary-foreground/85"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-white/60" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Free Consultation — takes 2 columns, lighter blue accent */}
              <Reveal delay={2} className="lg:col-span-2">
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-primary/25 bg-primary/5 p-7 sm:p-8">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <h3 className="text-title font-bold text-foreground">
                        {services[3].title}
                      </h3>
                    </div>
                    <p className="mb-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {services[3].description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {services[3].items.map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
