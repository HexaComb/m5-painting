"use client";

import { Star, Quote } from "lucide-react";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Review } from "@/lib/content-types";

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );
}

export function Reviews({ initialReviews }: { initialReviews?: Review[] | null }) {
  const queryReviews = useQuery(api.content.getReviews);
  const reviews = queryReviews === undefined ? initialReviews : queryReviews;
  if (!reviews) return null;
  return (
    <section id="reviews" className="relative bg-primary py-20 sm:py-28">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='18' r='1' fill='white'/%3E%3Ccircle cx='48' cy='8' r='0.7' fill='white'/%3E%3Ccircle cx='65' cy='42' r='0.9' fill='white'/%3E%3Ccircle cx='28' cy='65' r='0.6' fill='white'/%3E%3Ccircle cx='55' cy='75' r='1.1' fill='white'/%3E%3C/svg%3E")`
      }} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section header */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
              Straight From Our Neighbors
            </p>
            <h2 className="mt-2 text-headline font-bold text-primary-foreground">
              Don&apos;t Take Our Word for It
            </h2>
            <BrushStroke color="white" className="mx-auto mt-3 opacity-40" />
          </div>
        </Reveal>

        {/* Reviews — stacked full-width for variety, not card grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {reviews.map((review, i) => (
            <Reveal key={review._id} delay={Math.min(i + 1, 4) as 0 | 1 | 2 | 3 | 4}>
              <div className="relative flex h-full flex-col justify-between rounded-2xl bg-white/10 p-6 backdrop-blur-sm sm:p-7">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <StarRow />
                    <Quote className="h-5 w-5 text-white/20" />
                  </div>
                  <blockquote className="text-[0.95rem] leading-relaxed text-primary-foreground/90">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-primary-foreground">
                    {review.author}
                  </p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-primary-foreground/80">
                    {review.source}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
