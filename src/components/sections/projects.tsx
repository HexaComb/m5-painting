"use client";

import Image from "next/image";
import Script from "next/script";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { InstagramEmbed } from "@/components/instagram-embed";
import type { InstagramPost } from "@/lib/content-types";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const projectFallbacks = [
  {
    src: "/images/project-shop.webp",
    alt: "Freshly painted M5 shop exterior with crisp blue and white finishes",
    label: "Commercial refresh",
  },
  {
    src: "/images/project-door.webp",
    alt: "Detailed front door paint work with clean edges and a smooth finish",
    label: "Entry details",
  },
  {
    src: "/images/project-spray.webp",
    alt: "M5 painter applying an even spray finish on a prepared surface",
    label: "Spray finish",
  },
  {
    src: "/images/project-aerial.webp",
    alt: "Exterior painting project viewed from above with a clean roofline",
    label: "Exterior work",
  },
] as const;

export function Projects({
  initialPosts,
}: {
  initialPosts?: InstagramPost[] | null;
}) {
  const queryPosts = useQuery(api.content.getInstagramPosts);
  const posts = queryPosts === undefined ? initialPosts : queryPosts;

  useEffect(() => {
    if (posts && posts.length > 0) {
      window.instgrm?.Embeds.process();
    }
  }, [posts]);

  return (
    <section id="projects" className="relative bg-muted/40 py-20 sm:py-28">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-label-light">
              Our Work
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              Projects We&apos;re Proud Of
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Every home and business has a story. Here are a few
              transformations we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        {posts && posts.length > 0 ? (
          <Reveal>
            <div className="projects-instagram-feed grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <InstagramEmbed key={post._id} permalink={post.embedUrl} />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="grid auto-rows-[220px] gap-4 sm:auto-rows-[260px] md:grid-cols-4">
              {projectFallbacks.map((project, index) => (
                <figure
                  key={project.src}
                  className={`group relative overflow-hidden rounded-xl bg-brand-black shadow-lg shadow-brand-navy/10 ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 90vw, 50vw"
                        : "(max-width: 768px) 90vw, 25vw"
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/85 via-brand-black/35 to-transparent p-4 pt-16">
                    <figcaption className="text-sm font-bold text-on-dark">
                      {project.label}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 text-center">
            <a href="#contact" data-track="projects-estimate">
              <Button
                variant="outline"
                size="lg"
                className="brand-gradient-blue h-auto border-0 px-7 py-3.5 text-base font-bold text-white brand-glow hover:opacity-95"
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
