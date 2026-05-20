"use client";

import {
  Paintbrush,
  Home,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Service } from "@/lib/content-types";

const iconMap = {
  Home,
  Paintbrush,
  Building2,
  MessageSquare,
} as const;

type IconName = keyof typeof iconMap;

export function Services({ initialServices }: { initialServices?: Service[] | null }) {
  const queryServices = useQuery(api.content.getServices);
  const services = queryServices === undefined ? initialServices : queryServices;
  return (
    <section id="services" className="relative py-20 sm:py-28 paint-texture">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section header */}
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="text-label text-brand-blue">
              How We Can Help
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              What We Do
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              From a fresh coat in the living room to a full exterior
              makeover, we bring your vision to life.
            </p>
          </div>
        </Reveal>

        {/* Services — uniform 2x2 grid with consistent styling */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services?.map((service, idx) => {
            const Icon = iconMap[service.iconName as IconName] ?? Home;
            return (
              <Reveal key={service._id} delay={idx + 1} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-navy/20 bg-brand-black p-7 text-white shadow-xl shadow-brand-navy/20 transition-all hover:border-brand-electric/40 sm:p-8">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-electric/15 blur-2xl" />
                  <div className="relative mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg brand-gradient-blue shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-title font-bold">
                      {service.title}
                    </h3>
                  </div>
                  <p className="relative mb-6 text-[0.95rem] leading-relaxed text-brand-chrome/85">
                    {service.description}
                  </p>
                  <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-2">
                    {service.items.map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 text-sm text-brand-chrome/90"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-brand-electric" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
