import Link from "next/link";
import { ArrowUpRight, Building2, Home } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const paths = [
  {
    title: "Painting for your home",
    description:
      "Interior and exterior work for homes across Sanger and the Central Valley.",
    href: "/residential-painting",
    label: "Explore residential painting",
    icon: Home,
  },
  {
    title: "Painting for your business",
    description:
      "A dependable local crew for offices, retail spaces, and commercial properties.",
    href: "/commercial-painting",
    label: "Explore commercial painting",
    icon: Building2,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  label: string;
  icon: typeof Home;
}>;

export function ServicePaths() {
  return (
    <section
      aria-labelledby="service-paths-heading"
      className="border-b border-border bg-background py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <p className="text-label-light">A good place to start</p>
            <h2
              id="service-paths-heading"
              className="mt-2 text-headline font-bold text-foreground"
            >
              What are we painting for you?
            </h2>
            <p className="mt-3 text-body-lg text-muted-foreground">
              Choose the kind of project you have in mind. We&apos;ll help with
              the next step.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {paths.map(({ title, description, href, label, icon: Icon }, index) => (
            <Reveal key={href} delay={index + 1} className="h-full">
              <Link
                href={href}
                className="group flex h-full min-h-40 items-start gap-5 rounded-xl border border-brand-navy/15 bg-card p-6 shadow-sm transition-colors hover:border-brand-blue/40 hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-electric/50 sm:p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg brand-gradient-blue text-white shadow-md">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-xl font-bold text-foreground">
                    {title}
                  </span>
                  <span className="mt-2 block max-w-md text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
                    {label}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
