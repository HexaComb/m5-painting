"use client";

import { Star, ArrowUpRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Review } from "@/lib/content-types";

export function Reviews({
  initialReviews,
}: {
  initialReviews?: Review[] | null;
}) {
  const live = useQuery(api.content.getReviews);
  const reviews = live === undefined ? initialReviews : live;
  if (!reviews?.length) return null;
  return (
    <section
      id="reviews"
      className="m5-section m5-reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="m5-container">
        <div className="m5-section-heading">
          <div>
            <p className="m5-eyebrow">The local word</p>
            <h2 id="reviews-heading">
              Good work.
              <br />
              <span>Happy neighbors.</span>
            </h2>
          </div>
          <p>
            In their own words. Feedback from the people who have welcomed M5
            into their homes and businesses.
          </p>
        </div>
        <div className="m5-review-grid">
          {reviews
            .filter((r) => r.enabled !== false && !r.hiddenByAdmin)
            .map((review) => (
              <figure className="m5-review" key={review._id}>
                <div className="m5-review-top">
                  <span>{review.source}</span>
                  {review.rating !== undefined && (
                    <div
                      className="m5-review-stars"
                      role="img"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          aria-hidden="true"
                          fill={i < review.rating! ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {review.text.length > 420 ? (
                  <details className="m5-review-expand">
                    <summary>
                      <span>“{review.text.slice(0, 240).trim()}…”</span>
                      <small>Read full review +</small>
                    </summary>
                    <blockquote>“{review.text}”</blockquote>
                  </details>
                ) : (
                  <blockquote>“{review.text}”</blockquote>
                )}
                <figcaption>
                  <span className="m5-avatar" aria-hidden="true">
                    {review.author.slice(0, 1)}
                  </span>
                  <div>
                    <strong>{review.author}</strong>
                    <small>
                      {review.date &&
                        (Number.isNaN(new Date(review.date).getTime())
                          ? review.date
                          : new Date(review.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            }))}
                    </small>
                  </div>
                  {review.authorUri && (
                    <a
                      href={review.authorUri}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${review.author}’s review profile`}
                    >
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  )}
                </figcaption>
              </figure>
            ))}
        </div>
      </div>
    </section>
  );
}
