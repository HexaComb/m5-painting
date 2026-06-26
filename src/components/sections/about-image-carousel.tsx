"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AboutImage } from "@/lib/content-types";

export function AboutImageCarousel({ images }: { images: AboutImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const nextIndex = (index + slideCount) % slideCount;
      setActiveIndex(nextIndex);
    },
    [slideCount],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (activeIndex >= slideCount) {
      setActiveIndex(0);
    }
  }, [activeIndex, slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  if (slideCount === 0) {
    return null;
  }

  const activeImage = images[activeIndex];

  return (
    <div className="relative mx-auto max-w-sm lg:max-w-none">
      <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-brand-navy/15">
        {images.map((image, index) => (
          <Image
            key={image._id}
            src={image.imageUrl}
            alt={image.alt}
            fill
            className={`object-cover transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 90vw, 40vw"
            priority={index === 0}
          />
        ))}

        {slideCount > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {slideCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image._id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-6 bg-brand-electric"
                  : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Show image ${index + 1}: ${image.alt}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Image {activeIndex + 1} of {slideCount}: {activeImage.alt}
      </p>
    </div>
  );
}
