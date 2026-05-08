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
        {/* Hero: bold blue section */}
        <Hero />

        {/* Hero → Services: blue drips into white */}
        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        {/* Services: white background */}
        <Services />

        {/* Projects: subtle muted bg */}
        <Projects />

        {/* About: white background */}
        <About />

        {/* About → Reviews: white drips into blue */}
        <div className="bg-primary">
          <PaintDripAlt color="var(--background)" className="-mb-px" />
        </div>

        {/* Reviews: blue section */}
        <Reviews />

        {/* Reviews → Contact: blue drips into white */}
        <div className="bg-background">
          <PaintDrip color="var(--primary)" className="-mb-px" />
        </div>

        {/* Contact: white background */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
