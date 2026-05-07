import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BrushStroke, PaintSplatter } from "@/components/ui/paint-decorations";

const reviews = [
  {
    text: "Great to work with. Very happy with the job Matt and his crew did on the exterior of our home. It was a big project. I would recommend them to have a job done right.",
    author: "Kara B.",
    date: "June 2025",
    source: "Yelp",
  },
  {
    text: "Matt and his M5 painting team were amazing. Signed, Sealed and Delivered. Finished the inside of my rental home in one day! On time and very professional. I would recommend M5 to anyone.",
    author: "Nick C.",
    date: "June 2025",
    source: "Yelp",
  },
  {
    text: "I highly recommend M5 Painting for any exterior paint work! They did an outstanding job on my home — from the stucco to the trim, everything looks fresh, clean, and professionally done. They helped me choose the perfect color for the stucco, and their attention to detail on the trimming made a huge difference in the final look.",
    author: "Krystle P.",
    date: "June 2025",
    source: "Angi",
  },
  {
    text: "Matt and his crew did an amazing job of meeting all our needs and expectations! The time and quality of work was outstanding. Would highly recommend!",
    author: "Victoria F.",
    date: "June 2025",
    source: "Angi",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative py-16 sm:py-24">
      {/* Background paint accent */}
      <PaintSplatter
        color="var(--primary)"
        size={160}
        className="pointer-events-none absolute -left-8 top-1/3 opacity-15"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Straight From Our Neighbors
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Don&apos;t Take Our Word for It
          </h2>
          <BrushStroke color="var(--primary)" className="mx-auto mt-2" />
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from the families and business owners we&apos;ve had the
            pleasure of working with right here in the Valley.
          </p>
        </div>

        {/* Review cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((review, i) => (
            <Card key={i} className="group relative flex flex-col justify-between overflow-hidden p-6">
              {/* Subtle paint blob on hover */}
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-yellow-400/5 transition-transform duration-500 group-hover:scale-[2]" />

              <div className="relative">
                <StarRating />
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </div>
              <div className="relative mt-4 flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    — {review.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {review.source}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
