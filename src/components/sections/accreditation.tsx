function BbbAccreditedMark() {
  return (
    <div
      className="flex w-full max-w-md overflow-hidden rounded-xl border-2 border-brand-black bg-brand-black text-white shadow-xl shadow-brand-navy/15"
      aria-label="BBB Accredited Business"
    >
      <div className="flex w-28 shrink-0 flex-col items-center justify-center bg-card px-4 py-5 text-brand-black sm:w-36">
        <svg
          viewBox="0 0 48 62"
          className="h-14 w-11"
          role="img"
          aria-label="Better Business Bureau torch"
        >
          <path
            d="M26 1c-5 8-13 12-15 23-1 7 3 13 11 17 6 3 10 6 8 12 7-6 12-14 9-24-2-10-10-16-13-28Z"
            fill="currentColor"
          />
          <path
            d="M16 33c-5 5-9 9-8 16 1 6 6 9 13 12 1-5 5-8 2-14-2-5-5-8-7-14Z"
            fill="currentColor"
          />
          <path
            d="M10 50h28l-2 6h-7l-2 6h-7l-2-6h-6l-2-6Z"
            fill="currentColor"
          />
        </svg>
        <span className="mt-1 text-3xl font-extrabold leading-none tracking-tight">
          BBB
        </span>
      </div>
      <div className="flex flex-1 items-center px-5 py-5 sm:px-7">
        <p className="font-heading text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
          Accredited
          <br />
          Business
        </p>
      </div>
    </div>
  );
}

export function Accreditation() {
  return (
    <section className="surface-proof-wall relative overflow-hidden py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-44 w-72 -translate-y-1/2 rounded-full bg-brand-electric/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <p className="text-label-light">Trusted Credentials</p>
          <h2 className="mt-2 text-title font-bold text-foreground">
            M5 Painting is a BBB Accredited Business.
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
            This accreditation sits alongside our licensed, bonded, and insured
            credentials as another sign that customers can expect honest,
            professional service from our family-run crew.
          </p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <BbbAccreditedMark />
        </div>
      </div>
    </section>
  );
}
