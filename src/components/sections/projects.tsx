"use client";

import Script from "next/script";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
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

export function Projects({
  initialPosts,
}: {
  initialPosts?: InstagramPost[] | null;
}) {
  const queryPosts = useQuery(api.content.getInstagramPosts);
  const posts = queryPosts === undefined ? initialPosts : queryPosts;

  const hasPosts = Boolean(posts && posts.length > 0);
  const [embedScriptReady, setEmbedScriptReady] = useState(false);

  useEffect(() => {
    if (embedScriptReady && posts && posts.length > 0) {
      window.instgrm?.Embeds.process();
    }
  }, [embedScriptReady, posts]);

  return (
    <section id="projects" className="surface-chrome-yard relative py-20 sm:py-28">
      {hasPosts ? (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="afterInteractive"
          onLoad={() => {
            setEmbedScriptReady(true);
            window.instgrm?.Embeds.process();
          }}
        />
      ) : null}

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-label-light">Our Work</p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              Projects We&apos;re Proud Of
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Every home and business has a story. Here are a few transformations
              we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        {posts && posts.length > 0 ? (
          <div className="mt-10">
            <Reveal>
              <p className="mb-4 text-center text-sm font-bold text-muted-foreground">
                Recent updates from the jobsite
              </p>
              <div className="projects-instagram-feed grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <InstagramEmbed
                    key={post._id}
                    permalink={post.embedUrl}
                    thumbnailUrl={post.thumbnailUrl}
                    embedReady={embedScriptReady}
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
