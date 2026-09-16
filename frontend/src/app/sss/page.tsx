import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatFaqCategoryLabel } from "@/lib/format";
import { fetchFaqCollection } from "@/lib/repositories/faqs";
import type { Faq, FaqCategory } from "@/lib/schemas/faq";

function groupFaqsByCategory(faqs: Faq[]): Map<FaqCategory, Faq[]> {
  const groupedFaqs = new Map<FaqCategory, Faq[]>();
  for (const faq of faqs) {
    const existingGroup = groupedFaqs.get(faq.category) ?? [];
    existingGroup.push(faq);
    groupedFaqs.set(faq.category, existingGroup);
  }
  return groupedFaqs;
}

function categoryAnchorId(category: FaqCategory): string {
  return `sss-${category}`;
}

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Kayıt süreci, programlar, günlük yaşam ve mali destek hakkında sık sorulan sorular.",
};

export default async function FaqPage() {
  const faqs = await fetchFaqCollection();
  const groupedFaqs = groupFaqsByCategory(faqs);
  const categories = Array.from(groupedFaqs.keys());

  return (
    <>
      <PageHero
        title="Sıkça Sorulan Sorular"
        description="Merak ettiklerinizin çoğu burada. Aradığınızı bulamazsanız bizimle iletişime geçmekten çekinmeyin."
        breadcrumbItems={[{ label: "Sıkça Sorulan Sorular" }]}
        image="/images/hero-contact.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[14rem_1fr]">
            <nav aria-label="SSS kategorileri" className="lg:sticky lg:top-28 lg:self-start">
              <ul className="space-y-1 border-l border-border">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      href={`#${categoryAnchorId(category)}`}
                      className="block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium text-ink-soft transition-colors hover:border-clay-500 hover:text-clay-600"
                    >
                      {formatFaqCategoryLabel(category)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-16">
              {Array.from(groupedFaqs.entries()).map(([category, categoryFaqs]) => (
                <div key={category} id={categoryAnchorId(category)} className="scroll-mt-28">
                  <h2 className="font-display text-display-sm text-ink">{formatFaqCategoryLabel(category)}</h2>
                  <Accordion className="mt-6">
                    {categoryFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={String(faq.id)}>
                        <AccordionTrigger className="text-lg text-ink">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-ink-soft">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
