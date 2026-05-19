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
    <blockquote
      className="instagram-media mx-auto min-h-[480px] w-full max-w-[540px] bg-transparent!"
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        background: "transparent",
        border: 0,
        margin: 0,
        maxWidth: "540px",
        minWidth: "326px",
        padding: 0,
        width: "100%",
      }}
    />
  );
}
