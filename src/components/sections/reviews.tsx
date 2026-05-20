"use client";

import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Review } from "@/lib/content-types";

/** Warm star tint: reads as gold on dark without default Tailwind yellow. */
const starClass =
  "h-3.5 w-3.5 fill-[oklch(0.78_0.055_78)] text-[oklch(0.78_0.055_78)]";

function StarRow({
  className,
  "aria-label": ariaLabel = "5 out of 5 stars",
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 ${className ?? ""}`}
      role="img"
      aria-label={ariaLabel}
    >
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={starClass} aria-hidden />
      ))}
    </div>
  );
}

function formatReviewDate(iso: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function Reviews({ initialReviews }: { initialReviews?: Review[] | null }) {
  const queryReviews = useQuery(api.content.getReviews);
  const reviews = queryReviews === undefined ? initialReviews : queryReviews;
  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="brand-surface-dark relative py-20 sm:py-28"
      aria-labelledby="reviews-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='18' r='1' fill='white'/%3E%3Ccircle cx='48' cy='8' r='0.7' fill='white'/%3E%3Ccircle cx='65' cy='42' r='0.9' fill='white'/%3E%3Ccircle cx='28' cy='65' r='0.6' fill='white'/%3E%3Ccircle cx='55' cy='75' r='1.1' fill='white'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <header className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-label text-brand-chrome">
              Local word
            </p>
            <h2
              id="reviews-heading"
              className="mt-2 text-headline font-bold text-white"
            >
              From homeowners around Sanger, Fresno, and nearby
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-14 brand-gradient-blue" />
          </header>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {reviews.map((review, i) => {
            const featured = i === 0;
            const dateLabel = formatReviewDate(review.date);

            return (
              <Reveal
                key={review._id}
                delay={Math.min(i + 1, 4) as 0 | 1 | 2 | 3 | 4}
                className={featured ? "lg:col-span-2" : undefined}
              >
                <figure
                  className={
                    featured
                      ? "relative overflow-hidden rounded-2xl border border-white/[0.12] bg-brand-navy/55 p-8 shadow-xl shadow-brand-navy/25 ring-1 ring-white/[0.06] sm:p-10"
                      : "relative flex h-full flex-col rounded-xl border border-white/[0.10] bg-brand-black/40 p-6 ring-1 ring-white/[0.04] sm:p-7"
                  }
                >
                  {featured ? (
                    <Quote
                      className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-brand-electric/[0.12] sm:h-20 sm:w-20"
                      aria-hidden
                    />
                  ) : null}

                  <div
                    className={
                      featured
                        ? "mb-6 flex flex-wrap items-center justify-between gap-4"
                        : "mb-4 flex items-center justify-between gap-3"
                    }
                  >
                    <StarRow className={featured ? "scale-110 gap-1" : undefined} />
                    {!featured ? (
                      <Quote
                        className="h-5 w-5 shrink-0 text-white/15"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <blockquote
                    className={
                      featured
                        ? "max-w-[65ch] text-body-lg leading-relaxed text-on-dark-secondary"
                        : "text-[0.95rem] leading-relaxed text-on-dark-secondary"
                    }
                  >
                    <p className="text-pretty">&ldquo;{review.text}&rdquo;</p>
                    <footer className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
                      <span className="font-heading text-base font-semibold text-white">
                        {review.author}
                      </span>
                      {dateLabel ? (
                        <span className="text-sm text-on-dark-muted">
                          <span className="mx-1 hidden text-on-dark-muted sm:inline">
                            ·
                          </span>
                          {dateLabel}
                        </span>
                      ) : null}
                      <cite className="text-label not-italic text-brand-chrome sm:ml-auto sm:text-right">
                        {review.source}
                      </cite>
                    </footer>
                  </blockquote>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
