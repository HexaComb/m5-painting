"use client";

import { useEffect, useRef, useState } from "react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramEmbedProps = {
  permalink: string;
  thumbnailUrl?: string;
  /** When true, parent has loaded embed.js and we should process this blockquote. */
  embedReady?: boolean;
};

export function InstagramEmbed({
  permalink,
  thumbnailUrl,
  embedReady = false,
}: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (!embedReady) return;
    window.instgrm?.Embeds.process();
  }, [permalink, embedReady]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (el.querySelector("iframe")) {
      setIframeLoaded(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) {
        setIframeLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [permalink, embedReady]);

  const showPlaceholder = !iframeLoaded;

  return (
    <div
      ref={containerRef}
      className="instagram-frame relative aspect-[9/16] min-h-[320px] w-full min-w-0 overflow-hidden rounded-xl border border-brand-navy/10 bg-muted shadow-lg shadow-brand-navy/5 sm:min-h-[380px]"
    >
      {showPlaceholder ? (
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted transition-opacity duration-300"
          aria-label="View on Instagram (loading embed)"
        >
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div
            className={`absolute inset-0 ${thumbnailUrl ? "bg-black/25" : "bg-muted"}`}
          />
          <div className="relative flex flex-col items-center gap-2 px-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">
              <InstagramIcon className="h-6 w-6 text-pink-600" />
            </span>
            <span className="text-xs font-medium text-white drop-shadow-sm">
              {thumbnailUrl ? "Loading reel…" : "Loading from Instagram…"}
            </span>
          </div>
        </a>
      ) : null}

      <blockquote
        className={`instagram-media mx-auto min-h-full w-full max-w-full bg-transparent! transition-opacity duration-300 ${
          iframeLoaded ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: "transparent",
          border: 0,
          margin: "0 auto",
          maxWidth: "100%",
          minWidth: "0",
          padding: 0,
          width: "100%",
        }}
      />
    </div>
  );
}
