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
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.faq");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/sss" } };
}

export default async function FaqPage() {
  const [hero, faqs] = await Promise.all([
    fetchPageContentBlock("faq.hero"),
    fetchFaqCollection(),
  ]);
  const groupedFaqs = groupFaqsByCategory(faqs);
  const categories = Array.from(groupedFaqs.keys());

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Sıkça Sorulan Sorular" }]}
        image={hero.image}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
            <nav aria-label="SSS kategorileri" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
              <ul className="space-y-1 border-l border-border">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      href={`#${categoryAnchorId(category)}`}
                      className="block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium text-ink-soft transition-colors hover:border-navy-800 hover:text-navy-800"
                    >
                      {formatFaqCategoryLabel(category)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Masaüstündeki sticky kategori menüsünün mobil karşılığı — yatay kaydırılabilir çip şeridi. */}
            <nav
              aria-label="SSS kategorileri"
              className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
            >
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${categoryAnchorId(category)}`}
                  className="shrink-0 snap-start rounded-full border border-border bg-paper px-4 py-2 text-sm font-bold text-ink-soft transition-colors hover:border-navy-800 hover:text-navy-800"
                >
                  {formatFaqCategoryLabel(category)}
                </a>
              ))}
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
