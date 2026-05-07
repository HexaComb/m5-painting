import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrushStroke } from "@/components/ui/paint-decorations";

const projects = [
  {
    src: "/images/project-shop.webp",
    alt: "White wood siding barn with large sliding door — exterior painting project",
    label: "Exterior · Commercial",
  },
  {
    src: "/images/project-logo-shop.webp",
    alt: "Building with M5 Painting logo on garage door — shop branding",
    label: "Exterior · Branding",
  },
  {
    src: "/images/project-aerial.webp",
    alt: "Aerial view of residential property after painting — completed project",
    label: "Exterior · Residential",
  },
  {
    src: "/images/project-spray.webp",
    alt: "M5 Painting crew member spray painting — professional service in action",
    label: "Exterior · In Progress",
  },
  {
    src: "/images/project-door.webp",
    alt: "Black front door with oval glass window — detail painting work",
    label: "Interior · Residential",
  },
  {
    src: "/images/paint-can.webp",
    alt: "Paint can with M5 Painting branding — quality materials",
    label: "Our Materials",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Work
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects We&apos;re Proud Of
          </h2>
          <BrushStroke color="var(--primary)" className="mx-auto mt-2" />
          <p className="mt-4 text-lg text-muted-foreground">
            Every home and business has a story. Here are a few of the
            transformations we&apos;ve been lucky to be part of.
          </p>
        </div>

        {/* Photo grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={project.src}
                alt={project.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
                  {project.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#contact">
            <Button variant="outline" size="lg" className="h-auto px-6 py-3 text-base">
              Let&apos;s Start Your Project
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
