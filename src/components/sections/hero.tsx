import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:py-32">
        {/* Text content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Residential &amp; Commercial
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="text-primary">M5 Painting</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              We bring fresh, vibrant transformations to your space. Our skilled team
              specializes in delivering expert painting services and tailored property
              enhancements for both residential and commercial properties.
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
                Premium Quality
                <br />5 Star Service
              </span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/hero-banner.webp"
              alt="M5 Painting — Residential and Commercial painting services"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Decorative accent */}
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
        </div>
      </div>
    </section>
  );
}
