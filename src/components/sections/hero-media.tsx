"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroMediaType } from "@/lib/content-types";

export function HeroMedia({
  src,
  type,
  alt,
  priority = false,
  sizes,
  className = "object-cover",
}: {
  src: string;
  type: HeroMediaType;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (type === "video") {
    return (
      <video
        src={src}
        className={`h-full w-full ${className}`}
        muted
        loop
        playsInline
        autoPlay={!reduceMotion}
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={src.startsWith("http")}
    />
  );
}

export function HeroMediaPreview({
  src,
  type,
  alt,
}: {
  src: string;
  type: HeroMediaType;
  alt: string;
}) {
  if (type === "video") {
    return (
      <video
        src={src}
        className="h-full w-full object-cover"
        controls
        playsInline
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      unoptimized={src.startsWith("blob:") || src.startsWith("http")}
    />
  );
}
