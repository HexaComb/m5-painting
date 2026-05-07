import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">M5 Painting</h1>
          <p className="text-lg text-muted-foreground">
            Family-owned painting business in Central Valley, California.
          </p>
        </div>

        {/* Color Palette Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#1470AF</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-secondary border" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#E9ECEF</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-accent border" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">Blue tint</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-muted border" />
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">#FAFAFA</p>
            </div>
          </div>
        </section>

        {/* Button Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Get a Free Estimate</Button>
            <Button variant="secondary">Our Services</Button>
            <Button variant="outline">Learn More</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="destructive">Cancel</Button>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Typography</h2>
          <div className="space-y-2">
            <p className="text-foreground">
              Primary text — used for body content and headings.
            </p>
            <p className="text-muted-foreground">
              Muted text — used for secondary information and descriptions.
            </p>
            <p className="text-primary">
              Brand text — the M5 Painting blue for emphasis and links.
            </p>
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t text-sm text-muted-foreground text-center">
        <p>&copy; {new Date().getFullYear()} M5 Painting. All rights reserved.</p>
      </footer>
    </div>
  );
}
