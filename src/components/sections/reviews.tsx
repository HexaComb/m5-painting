"use client";

import { Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Review } from "@/lib/content-types";

const starClass = "chrome-star h-3.5 w-3.5";

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
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function sourceSummary(reviews: Review[]) {
  return Array.from(
    new Set(reviews.map((review) => review.source).filter(Boolean))
  ).join(" and ");
}

export function Reviews({ initialReviews }: { initialReviews?: Review[] | null }) {
  const queryReviews = useQuery(api.content.getReviews);
  const reviews = queryReviews === undefined ? initialReviews : queryReviews;
  if (!reviews || reviews.length === 0) return null;

  const sources = sourceSummary(reviews);

  return (
    <section
      id="reviews"
      className="surface-proof-wall paint-texture relative py-20 sm:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-label-light">Local word</p>
            <h2
              id="reviews-heading"
              className="mt-2 text-headline font-bold text-foreground"
            >
              Good work gets talked about.
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Homeowners around the Valley call out the same things: careful
              prep, clean finishes, and a crew that follows through.
            </p>

            <div className="mt-7 border-y border-border py-5">
              <StarRow />
              <div className="mt-3 space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Five-star rated by local customers
                </p>
                {sources ? (
                  <p className="text-sm text-muted-foreground">
                    Reviews gathered from {sources}.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-border border-y border-border">
              {reviews.map((review, i) => {
                const dateLabel = formatReviewDate(review.date);

                return (
                  <div key={review._id} className="py-7 sm:py-8">
                    <figure className="grid gap-5 sm:grid-cols-[7rem_1fr] sm:gap-8">
                      <div className="space-y-2">
                        <p className="text-[0.65rem] font-bold leading-none tracking-[0.15em] text-brand-blue/60">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <StarRow />
                      </div>

                      <blockquote>
                        <p className="text-pretty text-body-lg text-foreground">
                          &ldquo;{review.text}&rdquo;
                        </p>
                        <footer className="mt-5 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                          <span className="font-heading text-base font-semibold text-foreground">
                            {review.author}
                          </span>
                          {dateLabel ? (
                            <span className="text-sm text-muted-foreground">
                              <span className="mx-1 hidden text-muted-foreground sm:inline">
                                ·
                              </span>
                              {dateLabel}
                            </span>
                          ) : null}
                          <cite className="text-sm font-semibold not-italic text-brand-blue sm:ml-auto sm:text-right">
                            {review.source}
                          </cite>
                        </footer>
                      </blockquote>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
