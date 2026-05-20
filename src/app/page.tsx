import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";
import { PaintDrip } from "@/components/ui/paint-decorations";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultHeroContent,
  defaultServices,
  defaultAboutContent,
  defaultAboutValues,
  defaultInstagramPosts,
  defaultReviews,
  defaultContactContent,
} from "@/lib/default-content";

let buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json hasn't been generated yet (e.g. `next dev`)
}

const content = buildContent ?? {
  siteSettings: defaultSiteSettings,
  heroContent: defaultHeroContent,
  services: defaultServices,
  aboutContent: defaultAboutContent,
  aboutValues: defaultAboutValues,
  instagramPosts: defaultInstagramPosts,
  reviews: defaultReviews,
  contactContent: defaultContactContent,
};

export default function Home() {
  return (
    <>
      <Header initialSettings={content.siteSettings} />
      <main>
        <Hero
          initialHero={content.heroContent}
          initialSettings={content.siteSettings}
        />

        <div className="relative z-10 bg-brand-navy">
          <PaintDrip color="var(--background)" />
        </div>

        <Services initialServices={content.services} />
        <Projects initialPosts={content.instagramPosts} />

        <About
          initialAbout={content.aboutContent}
          initialValues={content.aboutValues}
        />

        <Separator className="h-px bg-brand-blue/35" />

        <Reviews initialReviews={content.reviews} />

        <Separator className="h-px bg-brand-electric/30" />

        <Contact
          initialContact={content.contactContent}
          initialSettings={content.siteSettings}
        />
      </main>
      <Footer initialSettings={content.siteSettings} />
    </>
  );
}
