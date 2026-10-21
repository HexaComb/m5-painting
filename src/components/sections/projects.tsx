"use client";

import Image from "next/image";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { InstagramEmbed } from "@/components/instagram-embed";
import type { InstagramPost } from "@/lib/content-types";
import { useQuery } from "convex/react";

const instagramExteriorReel =
  "https://www.instagram.com/m5painting/reel/DbeuApRBkL8/";

const localProjects = [
  {
    title: "A sharper exterior",
    description: "Fresh blue shutters and crisp trim bring new definition to this home.",
    src: "/images/exterior-finish-instagram.webp",
    alt: "Finished exterior repaint with crisp white trim and fresh blue shutters",
    sourceUrl: instagramExteriorReel,
  },
  {
    title: "A sharper welcome home",
    description: "A deep blue front door with crisp white trim.",
    src: "/images/project-door.webp",
    alt: "Freshly painted deep blue front door with white trim",
  },
  {
    title: "A commercial exterior",
    description: "Exterior painting for a local business property.",
    src: "/images/project-logo-shop.webp",
    alt: "M5 Painting logo on the garage door of a freshly painted commercial building",
  },
  {
    title: "A home from every angle",
    description: "Aerial view of a completed residential project.",
    src: "/images/project-aerial.webp",
    alt: "Aerial view of a completed Central Valley home project",
  },
] satisfies Array<{
  title: string;
  description: string;
  src: string;
  alt: string;
  sourceUrl?: string;
}>;

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export function Projects({
  initialPosts,
}: {
  initialPosts?: InstagramPost[] | null;
}) {
  const queryPosts = useQuery(api.content.getInstagramPosts);
  const posts = queryPosts === undefined ? initialPosts : queryPosts;

  const hasPosts = Boolean(posts && posts.length > 0);
  const [embedScriptReady, setEmbedScriptReady] = useState(false);
  const [shouldLoadEmbeds, setShouldLoadEmbeds] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const requestEmbeds = useCallback(() => {
    setShouldLoadEmbeds(true);
  }, []);

  useEffect(() => {
    if (!hasPosts || shouldLoadEmbeds) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadEmbeds(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPosts, shouldLoadEmbeds]);

  useEffect(() => {
    if (embedScriptReady && posts && posts.length > 0) {
      window.instgrm?.Embeds.process();
    }
  }, [embedScriptReady, posts]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="surface-chrome-yard relative py-16 sm:py-20 lg:py-24"
    >
      {hasPosts && shouldLoadEmbeds ? (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => {
            setEmbedScriptReady(true);
            window.instgrm?.Embeds.process();
          }}
        />
      ) : null}

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mb-9 max-w-2xl">
            <p className="text-label-light">Real work, right here in the Valley</p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              See what careful prep and a fresh coat can do.
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-5 max-w-xl text-body-lg text-muted-foreground">
              A few homes, details, and job sites painted by the M5 crew.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <Reveal className="lg:col-span-5">
            <figure className="h-full overflow-hidden rounded-xl border border-brand-navy/10 bg-brand-black shadow-sm">
              <video
                className="mx-auto aspect-[9/16] w-full max-w-[360px] bg-brand-black object-contain lg:max-w-none"
                controls
                playsInline
                preload="metadata"
                poster="/images/exterior-finish-instagram.webp"
                aria-label="M5 Painting's exterior refresh video, from preparation through finished work"
              >
                <source
                  src="/videos/exterior-refresh-instagram.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video element.
              </video>
              <figcaption className="flex min-h-32 flex-col justify-between gap-3 bg-card p-5 sm:p-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Exterior refresh, from prep to finish
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    See an M5 crew bring a Central Valley home back to life.
                  </p>
                </div>
                <a
                  href={instagramExteriorReel}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-xs font-bold text-brand-blue underline decoration-brand-blue/30 underline-offset-4 hover:decoration-brand-blue focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50"
                >
                  From M5 on Instagram
                </a>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {localProjects.map((project, index) => (
              <Reveal
                key={project.src}
                delay={Math.min(index + 1, 4)}
                className="h-full"
              >
                <figure className="h-full overflow-hidden rounded-xl border border-brand-navy/10 bg-card shadow-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 42vw, 24vw"
                    />
                  </div>
                  <figcaption className="flex min-h-28 flex-col justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    {project.sourceUrl ? (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit text-xs font-bold text-brand-blue underline decoration-brand-blue/30 underline-offset-4 hover:decoration-brand-blue focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50"
                      >
                        From M5 on Instagram
                      </a>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div className="mt-14 border-t border-border pt-10">
            <Reveal>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-label-light">Follow along</p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-foreground">
                    More from M5 on Instagram
                  </h3>
                </div>
                <a
                  href="https://www.instagram.com/m5painting/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-brand-blue underline decoration-brand-blue/30 underline-offset-4 hover:decoration-brand-blue"
                >
                  Visit @m5painting
                </a>
              </div>
              <div className="projects-instagram-feed grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <InstagramEmbed
                    key={post._id}
                    permalink={post.embedUrl}
                    thumbnailUrl={post.thumbnailUrl}
                    embedReady={embedScriptReady}
                    loadRequested={shouldLoadEmbeds}
                    onRequestLoad={requestEmbeds}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        ) : null}

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
