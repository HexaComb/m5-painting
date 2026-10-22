import type { Faq } from "@/lib/content-types";

export type FaqPageItem = Pick<Faq, "question" | "answer">;

export function resolveFaqs(
  faqs: Faq[] | null | undefined,
  fallback: Faq[],
): Faq[] {
  return faqs?.length ? faqs : fallback;
}

export function buildFaqPageJsonLd(faqs: FaqPageItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
