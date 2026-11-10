"use client";

import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Service } from "@/lib/content-types";

const visuals: Record<string, { src: string; alt: string; href: string }> = {
  "Interior Painting": {
    src: "/images/paint-can.webp",
    alt: "M5 Painting's paint and materials on the job",
    href: "/interior-painting",
  },
  "Exterior Painting": {
    src: "/images/project-door.webp",
    alt: "Painted home entry with crisp white trim",
    href: "/exterior-painting",
  },
  "Commercial Painting": {
    src: "/images/project-logo-shop.webp",
    alt: "M5 Painting shop exterior and signage",
    href: "/commercial-painting",
  },
};
export function Services({
  initialServices,
}: {
  initialServices?: Service[] | null;
}) {
  const live = useQuery(api.content.getServices);
  const services = live === undefined ? initialServices : live;
  return (
    <section id="services" className="m5-section m5-services">
      <div className="m5-container">
        <div className="m5-section-heading">
          <div>
            <p className="m5-eyebrow">A fresh perspective</p>
            <h2>
              Your space.
              <br />
              <span>Beautifully renewed.</span>
            </h2>
          </div>
          <p>
            From the rooms you live in to the first impression you make.
            Thoughtful painting for homes and businesses across the Valley.
          </p>
        </div>
        <div className="m5-service-grid">
          {services
            ?.filter((s) => s.title !== "Free Consultation")
            .map((service) => {
              const visual = visuals[service.title];
              return (
                <article key={service._id} className="m5-service-card">
                  {visual && (
                    <a
                      className="m5-service-image"
                      href={visual.href}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={visual.src}
                        alt=""
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                      />
                    </a>
                  )}
                  <div className="m5-service-body">
                    <h3>
                      <a href={visual?.href ?? "#contact"}>
                        {service.title}
                        <ArrowUpRight size={22} aria-hidden="true" />
                      </a>
                    </h3>
                    <p>{service.description}</p>
                    <ul>
                      {service.items.map((item) => (
                        <li key={item}>
                          <Check size={13} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
        </div>
        {services
          ?.filter((s) => s.title === "Free Consultation")
          .map((s) => (
            <div className="m5-consultation" key={s._id}>
              <div>
                <h3>Every great project starts with a conversation.</h3>
                <p>{s.description}</p>
              </div>
              <a className="m5-text-link" href="#contact">
                Let’s talk it through{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
          ))}
      </div>
    </section>
  );
}
