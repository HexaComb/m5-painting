import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PaintSplatter } from "@/components/ui/paint-decorations";
import { Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/30">
      {/* Decorative paint splatters */}
      <PaintSplatter
        color="var(--primary)"
        size={200}
        className="pointer-events-none absolute -right-10 -top-10 opacity-40"
      />
      <PaintSplatter
        color="var(--primary)"
        size={150}
        className="pointer-events-none absolute -left-8 bottom-20 opacity-30"
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:py-32">
        {/* Text content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Family-Owned &amp; Locally Operated
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Neighbors at{" "}
              <span className="relative inline-block text-primary">
                M5 Painting
                {/* Brush-stroke underline accent */}
                <svg
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M2,8 C20,3 40,6 60,4 C80,2 100,7 120,5 C140,3 160,8 180,4 C190,3 196,6 198,5"
                    stroke="var(--primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.35"
                  />
                </svg>
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              We&apos;re a family-run painting crew right here in the Central
              Valley. From the first walkthrough to the final coat, we treat
              your home like it&apos;s our own — because to us, every project is
              personal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#contact">
              <Button size="lg" className="text-base px-6 py-3 h-auto">
                Get a Free Estimate
              </Button>
            </a>
            <a href="tel:5594511022">
              <Button variant="outline" size="lg" className="text-base px-6 py-3 h-auto">
                <Phone className="mr-2 h-4 w-4" />
                559-451-1022
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/lbi-badge.webp"
                alt="Licensed, Bonded and Insured"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <span className="text-xs font-medium text-muted-foreground">
                Licensed, Bonded
                <br />
                &amp; Insured
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/quality-badge.webp"
                alt="Premium Quality 5 Star"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <span className="text-xs font-medium text-muted-foreground">
                5-Star Reviews
                <br />
                on Yelp &amp; Angi
              </span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/hero-banner.webp"
              alt="The M5 Painting team — family-owned painting in Central Valley, CA"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Paint-stroke frame accent */}
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
          <PaintSplatter
            color="var(--primary)"
            size={80}
            className="pointer-events-none absolute -bottom-8 -left-6 opacity-50"
          />
        </div>
      </div>
    </section>
  );
}
