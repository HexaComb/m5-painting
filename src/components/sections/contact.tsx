"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="bg-primary py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">
                Let&apos;s Talk
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Us for a Free Quote!
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
                Ready to transform your space? Reach out and we&apos;ll get back to you
                with a free, no-obligation estimate.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="tel:5594511022"
                className="flex items-center gap-3 text-primary-foreground/90 transition-colors hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Call us</p>
                  <p className="text-sm font-semibold">559-451-1022</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Serving</p>
                  <p className="text-sm font-semibold">
                    Central Valley, California
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Email</p>
                  <p className="text-sm font-semibold">
                    m5paintingco@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: wire up form submission
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-primary-foreground/80"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-primary-foreground/80"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(559) 000-0000"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-primary-foreground/80"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="interest"
                  className="text-sm font-medium text-primary-foreground/80"
                >
                  I&apos;m Interested In
                </label>
                <select
                  id="interest"
                  name="interest"
                  className="flex h-9 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/50 focus-visible:border-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-900">
                    Select an option
                  </option>
                  <option value="interior" className="text-gray-900">
                    Interior Painting
                  </option>
                  <option value="exterior" className="text-gray-900">
                    Exterior Painting
                  </option>
                  <option value="commercial" className="text-gray-900">
                    Commercial Painting
                  </option>
                  <option value="consultation" className="text-gray-900">
                    Color Consultation
                  </option>
                  <option value="other" className="text-gray-900">
                    Other
                  </option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-primary-foreground/80"
                >
                  Message <span className="text-white/50">(required)</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="h-auto w-full px-6 py-3 text-base font-semibold"
              >
                Contact M5 Painting Now!
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
