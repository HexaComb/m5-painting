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
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section header */}
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

        {/* Services — uniform 2x2 grid with consistent styling */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services?.map((service, idx) => {
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
                  <p className="mb-6 text-[0.95rem] leading-relaxed text-primary-foreground/80">
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
      </div>
    </section>
  );
}
