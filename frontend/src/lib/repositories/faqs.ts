import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { createCollectionEnvelopeSchema } from "@/lib/schemas/common";
import { FaqSchema, type Faq } from "@/lib/schemas/faq";
import { mockFaqs } from "@/mocks/faqs";

const FaqCollectionResponseSchema = createCollectionEnvelopeSchema(FaqSchema);

export async function fetchFaqCollection(): Promise<Faq[]> {
  if (!isApiConfigured()) {
    return sortByOrder(mockFaqs);
  }

  const response = await fetchJson("/api/faqs", FaqCollectionResponseSchema, { tags: ["faqs"] });
  return sortByOrder(response.data);
}

function sortByOrder(faqs: Faq[]): Faq[] {
  return [...faqs].sort((firstFaq, secondFaq) => firstFaq.sortOrder - secondFaq.sortOrder);
}
