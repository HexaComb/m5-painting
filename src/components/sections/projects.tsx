"use client";

import Script from "next/script";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "convex/react";
import { useCallback, useEffect, useState } from "react";
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
  const [shouldLoadEmbeds, setShouldLoadEmbeds] = useState(false);

  const requestEmbeds = useCallback(() => {
    setShouldLoadEmbeds(true);
  }, []);

  useEffect(() => {
    if (embedScriptReady && posts && posts.length > 0) {
      window.instgrm?.Embeds.process();
    }
  }, [embedScriptReady, posts]);

  return (
    <section id="projects" className="m5-section m5-projects">
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

      <div className="m5-container">
        <Reveal>
          <div className="m5-section-heading">
            {" "}
            <div>
              <p className="m5-eyebrow">Out in the Valley</p>
              <h2 className="">Real homes. Real care.</h2>
            </div>
            <p className="">
              Every home and business has a story. Here are a few
              transformations we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        <div className="m5-project-gallery">
          <figure className="m5-project-wide">
            <div>
              <Image
                src="/images/project-aerial.webp"
                alt="Aerial view of an M5 Painting residential project in the Central Valley"
                fill
                sizes="(max-width: 760px) 100vw, 65vw"
              />
            </div>
            <figcaption>
              <span>Made for everyday living</span>
              <small>Residential exterior</small>
            </figcaption>
          </figure>
          <figure>
            <div>
              <Image
                src="/images/project-spray.webp"
                alt="M5 Painting crew carefully spray painting a home exterior"
                fill
                sizes="(max-width: 760px) 100vw, 35vw"
              />
            </div>
            <figcaption>
              <span>Care in every coat</span>
              <small>On the job with M5</small>
            </figcaption>
          </figure>
        </div>
        {posts && posts.length > 0 ? (
          <details
            className="m5-social-details"
            onToggle={(event) => {
              if (event.currentTarget.open) requestEmbeds();
            }}
          >
            <summary>
              More from our jobsites{" "}
              <ArrowUpRight size={19} aria-hidden="true" />
            </summary>
            <div className="mt-8">
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
                      loadRequested={shouldLoadEmbeds}
                      onRequestLoad={requestEmbeds}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </details>
        ) : null}

        <Reveal>
          <div className="mt-10 text-center">
            <a href="#contact" data-track="projects-estimate">
              <Button variant="outline" size="lg" className="m5-button">
                Let&apos;s Start Your Project
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
