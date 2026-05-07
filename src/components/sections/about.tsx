import Image from "next/image";
import { Heart, Handshake, Shield, Palette } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "We Care Like Family",
    description:
      "Your home is where your family makes memories. We get that — it's why we show up with the same care and respect we'd bring to our own parents' house.",
  },
  {
    icon: Handshake,
    title: "Honest From Day One",
    description:
      "No hidden fees, no surprise charges, no cutting corners. We give you a fair quote, show up when we say we will, and make sure you're happy before we pack up.",
  },
  {
    icon: Shield,
    title: "Licensed, Bonded & Insured",
    description:
      "We're fully licensed, bonded, and insured — so you can relax knowing you and your property are protected on every single job.",
  },
  {
    icon: Palette,
    title: "Your Vision, Our Hands",
    description:
      "Every home is different and every owner has their own style. We sit down with you, listen to what you want, and bring it to life — whether that's a bold accent wall or a complete refresh.",
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
                alt="Matt and the M5 Painting crew on a job site"
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
                The Family Behind Every Coat
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built on Hard Work &amp; Handshakes
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                M5 Painting started the way most good things do — with a family
                that knows how to work hard. We grew up right here in the Central
                Valley, and when we started this business, we made a simple promise:
                treat every customer like a neighbor, because around here, they
                usually are.
              </p>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                Matt and the crew bring that same small-town work ethic to every
                project. We show up on time, we do quality work, and we don&apos;t
                leave until you love it. That&apos;s not a sales pitch — it&apos;s
                just how we were raised.
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
