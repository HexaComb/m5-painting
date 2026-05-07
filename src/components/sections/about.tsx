import Image from "next/image";
import { Shield, Star, Palette, Users } from "lucide-react";

const values = [
  {
    icon: Star,
    title: "Expert Craftsmanship",
    description:
      "We specialize in high-quality interior and exterior coatings. Our skilled team is committed to bringing precision and excellence to every project, transforming both residential and commercial spaces with stunning, long-lasting finishes.",
  },
  {
    icon: Users,
    title: "Trusted Professionals",
    description:
      "Our reputation is built on reliability, integrity and attention to detail. We treat every project with the utmost care, ensuring a seamless process from start to finish. Your satisfaction is our priority.",
  },
  {
    icon: Shield,
    title: "Licensed, Bonded & Insured",
    description:
      "We are fully licensed, bonded and insured, providing our clients with peace of mind on every project. This ensures that our services meet the highest standards of quality and professionalism.",
  },
  {
    icon: Palette,
    title: "Tailored Solutions",
    description:
      "Every space is unique and so is our approach. We take the time to understand your vision. Whether it's a simple refresh or a full-scale transformation, we deliver results that exceed expectations.",
  },
];

export function About() {
  return (
    <section id="about" className="bg-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/team-collage.webp"
                alt="M5 Painting team at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Story
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Experience Excellence with M5 Painting
              </h2>
              <p className="mt-4 text-lg italic text-muted-foreground">
                &ldquo;Bringing color to life with professional painting, quality finishes
                and creative solutions that feel fresh, vibrant and truly yours.&rdquo;
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
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
