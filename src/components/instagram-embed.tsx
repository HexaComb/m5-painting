"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramEmbedProps = {
  permalink: string;
};

export function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [permalink]);

  return (
    <div className="instagram-frame relative min-w-0 overflow-hidden rounded-xl border border-brand-navy/10 bg-card shadow-lg shadow-brand-navy/5">
      <blockquote
        className="instagram-media mx-auto min-h-[480px] w-full max-w-full bg-transparent!"
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
