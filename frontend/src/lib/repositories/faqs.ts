import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createCollectionEnvelopeSchema } from "@/lib/schemas/common";
import { FaqSchema, type Faq } from "@/lib/schemas/faq";
import { mockFaqs } from "@/mocks/faqs";

const FaqCollectionResponseSchema = createCollectionEnvelopeSchema(FaqSchema);

export async function fetchFaqCollection(): Promise<Faq[]> {
  if (!isApiConfigured()) {
    return sortByOrder(mockFaqs);
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/faqs", FaqCollectionResponseSchema, { tags: ["faqs"] });
      return sortByOrder(response.data);
    },
    sortByOrder(mockFaqs),
    "sıkça sorulan sorular",
  );
}

function sortByOrder(faqs: Faq[]): Faq[] {
  return [...faqs].sort((firstFaq, secondFaq) => firstFaq.sortOrder - secondFaq.sortOrder);
}
