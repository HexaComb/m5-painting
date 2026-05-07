import {
  Paintbrush,
  Home,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrushStroke } from "@/components/ui/paint-decorations";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    description:
      "Whether it's a single room or your whole house, we'll help you pick the perfect colors and make sure every wall, trim, and ceiling looks beautiful.",
    items: [
      "Single Room to Entire Home",
      "Textured & Faux Painting",
      "Wallpaper Removal",
      "Cabinet Refinishing",
      "Crown Molding & Trim",
      "Garage Floor Coating",
    ],
  },
  {
    icon: Paintbrush,
    title: "Exterior Painting",
    description:
      "Your home's first impression matters. We use top-quality paints and proven techniques so your exterior holds up against the Valley heat for years.",
    items: [
      "Stucco & Plaster",
      "Wood & Vinyl Siding",
      "Trim, Fence & Deck",
      "Brick Treatments",
      "Concrete Staining",
      "Pressure Washing",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Painting",
    description:
      "We work with local businesses, offices, and property managers to keep their spaces looking sharp. Big job or small, same attention to detail.",
    items: [
      "Office & Retail",
      "Restaurants & Hotels",
      "Healthcare Facilities",
      "Warehouses & Industrial",
      "Multi-Family Housing",
      "Gyms & Fitness",
    ],
  },
  {
    icon: MessageSquare,
    title: "Free Consultation",
    description:
      "Not sure where to start? Give us a call. We'll walk the job with you, talk through your ideas, and give you an honest quote.",
    items: [
      "On-Site Walkthrough",
      "Detailed Written Quote",
      "Color Advice",
      "No Obligation",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section header — left-aligned, not centered */}
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How We Can Help
            </p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              What We Do
            </h2>
            <BrushStroke color="var(--primary)" className="mt-3" />
            <p className="mt-5 text-body-lg text-muted-foreground">
              From a fresh coat in the living room to a full exterior
              makeover, we bring your vision to life.
            </p>
          </div>
        </Reveal>

        {/* Services — alternating layout, not uniform cards */}
        <div className="space-y-6">
          {/* Top row: two wide services */}
          <div className="grid gap-6 lg:grid-cols-2">
            {services.slice(0, 2).map((service, idx) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={idx + 1}>
                  <div className="group relative rounded-2xl bg-muted/60 p-7 transition-colors hover:bg-muted sm:p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-title font-bold text-foreground">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mb-6 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {service.items.map((item) => (
                        <p
                          key={item}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Bottom row: one wide + one narrow — different rhythm */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Commercial — takes 3 columns */}
            <Reveal delay={1} className="lg:col-span-3">
              <div className="group relative h-full rounded-2xl bg-primary p-7 text-primary-foreground sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-title font-bold">
                    {services[2].title}
                  </h3>
                </div>
                <p className="mb-6 max-w-lg text-[0.95rem] leading-relaxed text-primary-foreground/80">
                  {services[2].description}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {services[2].items.map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 text-sm text-primary-foreground/85"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-white/60" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Free Consultation — takes 2 columns, different feel */}
            <Reveal delay={2} className="lg:col-span-2">
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-primary/15 p-7 sm:p-8">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="text-title font-bold text-foreground">
                      {services[3].title}
                    </h3>
                  </div>
                  <p className="mb-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {services[3].description}
                  </p>
                </div>
                <div className="space-y-2">
                  {services[3].items.map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
