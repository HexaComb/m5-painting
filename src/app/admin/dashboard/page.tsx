"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Paintbrush,
  Star,
  FileText,
  Phone,
  Settings,
  Sparkles,
  Image,
  Info,
} from "lucide-react";

const sections = [
  {
    title: "Hero Section",
    description: "Main banner headline, tagline, and call-to-action",
    icon: Sparkles,
    href: "/admin/hero",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Services",
    description: "Painting services offered",
    icon: Paintbrush,
    href: "/admin/services",
    color: "bg-emerald-500/10 text-emerald-600",
    countKey: "services" as const,
  },
  {
    title: "About",
    description: "Company story and core values",
    icon: Info,
    href: "/admin/about",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Projects",
    description: "Instagram posts and reels for the portfolio section",
    icon: Image,
    href: "/admin/projects",
    color: "bg-pink-500/10 text-pink-600",
    countKey: "instagramPosts" as const,
  },
  {
    title: "Reviews",
    description: "Customer testimonials",
    icon: Star,
    href: "/admin/reviews",
    color: "bg-yellow-500/10 text-yellow-600",
    countKey: "reviews" as const,
  },
  {
    title: "Contact",
    description: "Contact information and form text",
    icon: Phone,
    href: "/admin/contact",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    title: "Event Tracking",
    description: "Custom analytics events for buttons",
    icon: Activity,
    href: "/admin/events",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    title: "Site Settings",
    description: "Business name, tagline, phone, email",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-slate-500/10 text-slate-600",
  },
];

export default function DashboardPage() {
  const services = useQuery(api.content.getServices);
  const instagramPosts = useQuery(api.content.getInstagramPosts);
  const reviews = useQuery(api.content.getReviews);
  const siteSettings = useQuery(api.content.getSiteSettings);

  const counts = {
    services: services?.length ?? 0,
    instagramPosts: instagramPosts?.length ?? 0,
    reviews: reviews?.length ?? 0,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
        <p className="mt-1 text-muted-foreground">
          Edit the content displayed on{" "}
          <span className="font-medium text-foreground">
            {siteSettings?.businessName ?? "M5 Painting"}
          </span>
          &apos;s website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Paintbrush className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.services}</p>
              <p className="text-xs text-muted-foreground">Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.reviews}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Website Sections</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.color}`}
                    >
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {section.title}
                      </CardTitle>
                      {"countKey" in section && section.countKey && (
                        <span className="text-xs text-muted-foreground">
                          {counts[section.countKey]} items
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 p-4">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Public API</p>
            <p className="mt-1">
              Your website can fetch all content from the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                /api/content
              </code>{" "}
              endpoint. Changes you make here are available immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
