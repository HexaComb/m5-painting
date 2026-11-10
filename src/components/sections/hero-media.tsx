"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeroMediaType } from "@/lib/content-types";

type DataSaverNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroMedia({
  src,
  type,
  alt,
  poster,
  priority = false,
  sizes,
  className = "object-cover",
}: {
  src: string;
  type: HeroMediaType;
  alt: string;
  poster?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [autoplayAllowed, setAutoplayAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const saveData = (navigator as DataSaverNavigator).connection?.saveData;
      setAutoplayAllowed(!media.matches && !saveData);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || type !== "video") return;
    if (autoplayAllowed && !userPaused.current) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [autoplayAllowed, src, type]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  if (type === "video") {
    return (
      <>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          style={
            poster
              ? {
                  backgroundImage: `url("${poster}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 30%",
                }
              : undefined
          }
          preload="none"
          className={`absolute inset-0 h-full w-full ${className}`}
          muted
          loop
          playsInline
          autoPlay={autoplayAllowed}
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button
          type="button"
          onClick={togglePlayback}
          className="m5-video-toggle"
          aria-label={playing ? "Pause hero video" : "Play hero video"}
        >
          {playing ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </>
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
        className="absolute inset-0 h-full w-full object-cover"
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
      unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
    />
  );
}
