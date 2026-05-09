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
import {
  defaultSiteSettings,
  defaultHeroContent,
  defaultServices,
  defaultProjects,
  defaultAboutContent,
  defaultAboutValues,
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
  projects: defaultProjects,
  aboutContent: defaultAboutContent,
  aboutValues: defaultAboutValues,
  reviews: defaultReviews,
  contactContent: defaultContactContent,
};

export default function Home() {
  return (
    <>
      <Header initialSettings={content.siteSettings} />
      <main>
        <Hero initialHero={content.heroContent} />

        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        <Services initialServices={content.services} />
        <Projects initialProjects={content.projects} />

        <About
          initialAbout={content.aboutContent}
          initialValues={content.aboutValues}
        />

        <div className="bg-primary">
          <PaintDripAlt color="var(--background)" className="-mb-px" />
        </div>

        <Reviews initialReviews={content.reviews} />

        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        <Contact initialContact={content.contactContent} />
      </main>
      <Footer
        initialSettings={content.siteSettings}
        initialContact={content.contactContent}
      />
    </>
  );
}
