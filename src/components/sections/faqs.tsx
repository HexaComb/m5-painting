import type { Faq } from "@/lib/content-types";

function linkedAnswer(answer: string) {
  const contactPattern =
    /(\+?1?[-.\s(]*\d{3}[).\s-]*\d{3}[.\s-]*\d{4}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
  const parts = answer.split(contactPattern);

  return parts.map((part, index) => {
    if (!part) return null;
    if (part.includes("@")) {
      return (
        <a
          key={index}
          className="font-medium text-brand-blue underline underline-offset-4"
          href={`mailto:${part}`}
        >
          {part}
        </a>
      );
    }
    if (/\d{3}/.test(part)) {
      const digits = part.replace(/\D/g, "");
      return (
        <a
          key={index}
          className="font-medium text-brand-blue underline underline-offset-4"
          href={`tel:${digits.length === 10 ? `+1${digits}` : digits}`}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="m5-section m5-faqs">
      <div className="m5-container m5-faq-layout">
        <div>
          <p className="m5-eyebrow">A little clarity</p>
          <h2
            id="faq-heading"
            className="text-headline font-bold text-foreground"
          >
            Before the first coat.
          </h2>
          <p className="m5-faq-intro">
            Have something else in mind? <a href="#contact">Just ask.</a>
          </p>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq) => (
            <details key={faq._id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 text-xl leading-none text-brand-blue transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                {linkedAnswer(faq.answer)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
