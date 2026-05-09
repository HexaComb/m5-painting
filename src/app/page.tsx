import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { PaintDrip, PaintDripAlt } from "@/components/ui/paint-decorations";
import type { SiteContent } from "@/lib/content-types";

async function fetchSiteContent(): Promise<SiteContent | null> {
  // Prefer the explicit site URL if available (covers local dev)
  const siteUrl =
    process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
    process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".convex.cloud", ".convex.site");

  if (!siteUrl) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${siteUrl}/api/content`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return (await res.json()) as SiteContent;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export default async function Home() {
  const content = await fetchSiteContent();

  return (
    <>
      <Header initialSettings={content?.siteSettings ?? null} />
      <main>
        {/* Hero: bold blue section */}
        <Hero initialHero={content?.heroContent ?? null} />

        {/* Hero → Services: blue drips into white */}
        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        {/* Services: white background */}
        <Services initialServices={content?.services ?? null} />

        {/* Projects: subtle muted bg */}
        <Projects initialProjects={content?.projects ?? null} />

        {/* About: white background */}
        <About
          initialAbout={content?.aboutContent ?? null}
          initialValues={content?.aboutValues ?? null}
        />

        {/* About → Reviews: white drips into blue */}
        <div className="bg-primary">
          <PaintDripAlt color="var(--background)" className="-mb-px" />
        </div>

        {/* Reviews: blue section */}
        <Reviews initialReviews={content?.reviews ?? null} />

        {/* Reviews → Contact: blue drips into white */}
        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        {/* Contact: white background */}
        <Contact initialContact={content?.contactContent ?? null} />
      </main>
      <Footer
        initialSettings={content?.siteSettings ?? null}
        initialContact={content?.contactContent ?? null}
      />
    </>
  );
}
