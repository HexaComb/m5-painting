"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function Projects() {
  const projects = useQuery(api.content.getProjects);
  if (!projects) return null;
  return (
    <section id="projects" className="relative bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Work
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              Projects We&apos;re Proud Of
            </h2>
            <BrushStroke color="var(--primary)" className="mx-auto mt-3" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Every home and business has a story. Here are a few
              transformations we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        {/* Uniform grid — every image same size */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal
              key={i}
              delay={Math.min(i + 1, 4) as 0 | 1 | 2 | 3 | 4}
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={project.imageUrl}
                  alt={project.altText}
                  fill
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                {/* Label on hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-5 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
                    {project.label}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <a href="#contact" data-track="projects-estimate">
              <Button
                variant="outline"
                size="lg"
                className="h-auto border-primary/20 px-7 py-3.5 text-base font-semibold hover:bg-primary hover:text-primary-foreground"
              >
                Let&apos;s Start Your Project
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
