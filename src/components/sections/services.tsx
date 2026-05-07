import {
  Paintbrush,
  Home,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { BrushStroke, PaintSplatter } from "@/components/ui/paint-decorations";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    description:
      "Whether it's a single room that needs a refresh or your whole house ready for a new look, we'll help you pick the perfect colors and make sure every wall, trim, and ceiling looks beautiful.",
    items: [
      "Single Room to Entire Home",
      "Textured and Faux Painting",
      "Wallpaper Removal / Installation",
      "Cabinet Painting & Refinishing",
      "Crown Molding and Trim",
      "Garage Floor Coating",
    ],
  },
  {
    icon: Paintbrush,
    title: "Exterior Painting",
    description:
      "Your home's first impression matters. We use high-quality paints and proven techniques so your exterior looks great and holds up against the Valley heat for years to come.",
    items: [
      "Stucco / Plaster Painting",
      "Wood & Vinyl Siding",
      "Trim, Fence & Deck Painting",
      "Brick Painting & Treatments",
      "Concrete Sealing & Staining",
      "Pressure Washing",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Painting",
    description:
      "We work with local businesses, offices, and property managers to keep their spaces looking sharp. Big job or small — we handle it all with the same attention to detail.",
    items: [
      "Office Buildings & Retail",
      "Restaurants & Hotels",
      "Gyms & Fitness Centers",
      "Healthcare Facilities",
      "Warehouses & Industrial",
      "Apartments & Multi-Family",
    ],
  },
  {
    icon: MessageSquare,
    title: "Free Consultation",
    description:
      "Not sure where to start? Give us a call and we'll come out, walk the job with you, talk through your ideas, and give you an honest quote — no pressure, no obligation.",
    items: [
      "On-Site Walkthrough",
      "Detailed Written Quote",
      "Color Advice & Guidance",
      "Absolutely No Obligation",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="relative bg-muted/50 py-16 sm:py-24">
      {/* Background paint accent */}
      <PaintSplatter
        color="var(--primary)"
        size={180}
        className="pointer-events-none absolute right-0 top-12 opacity-20"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How We Can Help
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What We Do
          </h2>
          <BrushStroke color="var(--primary)" className="mx-auto mt-2" />
          <p className="mt-4 text-lg text-muted-foreground">
            From a fresh coat in the living room to a full exterior
            makeover, we&apos;re here to bring your vision to life.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group relative overflow-hidden p-6 transition-shadow hover:shadow-lg"
              >
                {/* Subtle paint accent in corner on hover */}
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                </div>
                <p className="relative mb-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="relative grid grid-cols-1 gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
