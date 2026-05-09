"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrushStroke } from "@/components/ui/paint-decorations";
import { Reveal } from "@/components/ui/reveal";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

export function Contact() {
  const contact = useQuery(api.content.getContactContent);
  const submitLead = useMutation(api.content.submitLead);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!contact) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || submitted) return;

    const formData = new FormData(e.currentTarget);
    const interest = formData.get("interest") as string;

    if (!interest) {
      toast.error("Please select what you're looking for");
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string || undefined,
        email: formData.get("email") as string,
        interest,
        message: formData.get("message") as string,
      });
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.");
      e.currentTarget.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Left: info — 5 cols */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {contact.subtitle}
                  </p>
                  <h2 className="mt-2 text-headline font-bold text-foreground">
                    {contact.title}
                  </h2>
                  <BrushStroke color="var(--primary)" className="mt-3" />
                  <p className="mt-5 text-body-lg text-muted-foreground">
                    {contact.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Give us a call
                      </p>
                      <p className="text-sm font-bold">{contact.phone}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Based in
                      </p>
                      <p className="text-sm font-bold">
                        {contact.location}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Email us
                      </p>
                      <p className="text-sm font-bold">
                        {contact.email}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form — 7 cols */}
          <div className="lg:col-span-7">
            <Reveal delay={1}>
              <div className="rounded-2xl bg-muted/60 p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Message Sent!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thanks for reaching out. We'll get back to you soon.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form
                    data-track="contact-submit"
                    className="space-y-5"
                    onSubmit={handleSubmit}
                  >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-foreground"
                      >
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(559) 000-0000"
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-foreground"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                      className="h-11 bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="interest"
                      className="text-sm font-semibold text-foreground"
                    >
                      What Are You Looking For?
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      className="flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pick one
                      </option>
                      <option value="interior">Interior Painting</option>
                      <option value="exterior">Exterior Painting</option>
                      <option value="commercial">Commercial Painting</option>
                      <option value="consultation">
                        Just Want to Talk It Through
                      </option>
                      <option value="other">Something Else</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-foreground"
                    >
                      Tell Us About Your Project
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="What are you looking to have done? Any details help us give a better quote..."
                      rows={4}
                      required
                      className="bg-background"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="h-auto w-full px-6 py-3.5 text-base font-semibold shadow-lg shadow-primary/20"
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {submitting ? "Sending..." : "Send It Over"}
                  </Button>
                </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
