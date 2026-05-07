import {
  Paintbrush,
  Home,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    description:
      "Refresh your home's interior with professional painting that delivers smooth, even coverage and vibrant color. From single rooms to entire homes.",
    items: [
      "Single Room to Entire Home Painting",
      "Textured and Faux Painting",
      "Wallpaper Removal / Installation",
      "Cabinet Painting, Staining or Refinishing",
      "Crown Molding and Trim Painting",
      "Garage Floor Coating or Painting",
    ],
  },
  {
    icon: Paintbrush,
    title: "Exterior Painting",
    description:
      "Boost your home's curb appeal with professional exterior painting. Our skilled team uses top-quality paints and techniques to protect and beautify your home.",
    items: [
      "Stucco / Plaster Painting",
      "Wood & Vinyl Siding Painting",
      "Trim, Fence & Deck Painting",
      "Brick Painting and Treatments",
      "Concrete Sealing and Staining",
      "House Pressure Washing",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Painting",
    description:
      "From complex exterior projects to precise interior detailing, we handle it all. Office buildings, retail, restaurants, warehouses, and more.",
    items: [
      "Office Buildings & Retail Stores",
      "Restaurants & Hotels",
      "Gyms & Fitness Centers",
      "Healthcare Facilities",
      "Warehouses & Industrial",
      "Apartments & Multi-Family Properties",
    ],
  },
  {
    icon: MessageSquare,
    title: "Free Consultation",
    description:
      "Schedule a consultation to discuss your vision, design preferences, and ways to elevate your space. We'll walk the job, provide a quote, and offer color consultation.",
    items: [
      "On-Site Job Walk",
      "Detailed Written Quote",
      "Color Consultation",
      "No Obligation Estimate",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Do
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are here to bring your painting vision to life — from simple refreshes
            to full-scale transformations.
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
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
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
