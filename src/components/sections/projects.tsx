import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";

const projects = [
  {
    src: "/images/project-shop.webp",
    alt: "White wood siding barn with large sliding door after exterior paint",
    label: "Exterior",
    span: "large",
  },
  {
    src: "/images/project-spray.webp",
    alt: "M5 Painting crew member spray painting on a job site",
    label: "In Progress",
    span: "small",
  },
  {
    src: "/images/project-door.webp",
    alt: "Black front door with oval glass window, precision detail work",
    label: "Interior",
    span: "small",
  },
  {
    src: "/images/project-aerial.webp",
    alt: "Aerial view of a residential property after a full exterior repaint",
    label: "Residential",
    span: "large",
  },
  {
    src: "/images/project-logo-shop.webp",
    alt: "Building with M5 Painting branding on the garage door",
    label: "Commercial",
    span: "small",
  },
  {
    src: "/images/paint-can.webp",
    alt: "Premium paint can with M5 Painting branding",
    label: "Materials",
    span: "small",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Header — centered for this section */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Work
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              Projects We&apos;re Proud Of
            </h2>
            <BrushStroke color="var(--primary)" className="mx-auto mt-3" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              Every home and business has a story. Here are a few
              transformations we&apos;ve been lucky to be part of.
            </p>
          </div>
        </Reveal>

        {/* Masonry-style grid with varied sizes */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {projects.map((project, i) => (
            <Reveal
              key={i}
              delay={Math.min(i + 1, 4) as 0 | 1 | 2 | 3 | 4}
              className={
                project.span === "large" && i === 0
                  ? "sm:col-span-2 lg:col-span-2"
                  : project.span === "large" && i === 3
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
              }
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                  sizes={
                    project.span === "large"
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                {/* Label on hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-5 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
                    {project.label}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <a href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="h-auto border-primary/20 px-7 py-3.5 text-base font-semibold hover:bg-primary hover:text-primary-foreground"
              >
                Let&apos;s Start Your Project
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
