import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { PaintDrip, PaintDripAlt } from "@/components/ui/paint-decorations";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Hero → Services: white paint drips down onto the muted section */}
        <div className="bg-muted/50">
          <PaintDrip color="var(--background)" className="-mb-px" />
        </div>

        <Services />

        {/* Services → Projects: muted paint drips down onto white */}
        <div className="bg-background">
          <PaintDripAlt color="var(--muted)" className="-mb-px opacity-50" />
        </div>

        <Projects />

        {/* Projects → About: white paint drips down onto muted */}
        <div className="bg-muted/50">
          <PaintDrip color="var(--background)" className="-mb-px" />
        </div>

        <About />

        {/* About → Reviews: muted drips onto white */}
        <div className="bg-background">
          <PaintDripAlt color="var(--muted)" className="-mb-px opacity-50" />
        </div>

        <Reviews />

        {/* Reviews → Contact: white paint drips down onto primary */}
        <div className="bg-primary">
          <PaintDrip color="var(--background)" className="-mb-px" />
        </div>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
