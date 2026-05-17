"use client";

import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const ELFSIGHT_APP_ID = "1aa25ae7-53ab-4381-a393-0dd7094a4dc1";

export function Projects() {
  return (
    <section id="projects" className="relative bg-muted/40 py-20 sm:py-28">
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
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
            <div className="mx-auto mt-3 h-0.5 w-14 bg-primary" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Every home and business has a story. Here are a few
              transformations we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        {/* Instagram feed — 80vw on mobile; full container width on desktop for now */}
        <Reveal>
          <div className="projects-instagram-feed relative left-1/2 w-[80vw] max-w-[80vw] -translate-x-1/2 sm:static sm:w-full sm:max-w-none sm:translate-x-0">
            <div
              className={`elfsight-app-${ELFSIGHT_APP_ID} w-full min-w-0`}
              data-elfsight-app-lazy
            />
          </div>
        </Reveal>

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
