import Image from "next/image";
import { Heart, Handshake, Shield, Palette } from "lucide-react";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";

const values = [
  {
    icon: Heart,
    title: "We Care Like Family",
    description:
      "Your home is where your family makes memories. We show up with the same care we'd bring to our own parents' house.",
  },
  {
    icon: Handshake,
    title: "Honest From Day One",
    description:
      "No hidden fees, no surprises, no cutting corners. A fair quote, on time, and happy before we pack up.",
  },
  {
    icon: Shield,
    title: "Licensed, Bonded & Insured",
    description:
      "Fully licensed, bonded, and insured. You can relax knowing your property is protected.",
  },
  {
    icon: Palette,
    title: "Your Vision, Our Hands",
    description:
      "We listen to what you want and bring it to life, whether that's a bold accent wall or a complete refresh.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          {/* Image column — 5 cols, sticky on scroll */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-primary/10">
                  <Image
                    src="/images/team-collage.webp"
                    alt="The M5 Painting crew on a job site"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                </div>
                {/* Blue accent bar at bottom */}
                <div className="absolute -bottom-2 left-4 right-4 h-2 rounded-full bg-primary/30" />
              </div>
            </Reveal>
          </div>

          {/* Content column — 7 cols */}
          <div className="space-y-10 lg:col-span-7">
            <Reveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  The Family Behind Every Coat
                </p>
                <h2 className="mt-2 text-headline font-bold text-foreground">
                  Built on Hard Work
                  <br className="hidden sm:block" />
                  &amp; Handshakes
                </h2>
                <BrushStroke color="var(--primary)" className="mt-3" />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="space-y-4">
                <p className="text-body-lg text-muted-foreground">
                  M5 Painting started the way most good things do: a family
                  that knows how to work hard. We grew up right here in the
                  Central Valley, and when we started this business, we made a
                  simple promise: treat every customer like a neighbor, because
                  around here, they usually are.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  Our crew brings that same small-town work ethic to
                  every project. We show up on time, do quality work, and
                  don&apos;t leave until you love it. That&apos;s not a sales
                  pitch; it&apos;s just how we were raised.
                </p>
              </div>
            </Reveal>

            {/* Values — 2x2 grid with left border accent */}
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={Math.min(idx + 1, 4) as 0 | 1 | 2 | 3 | 4}>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
