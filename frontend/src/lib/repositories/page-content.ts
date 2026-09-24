import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createResourceEnvelopeSchema } from "@/lib/schemas/common";
import { PageContentSchema, type PageContent, type PageContentKey } from "@/lib/schemas/page-content";
import { mockPageContent } from "@/mocks/page-content";

const PageContentResponseSchema = createResourceEnvelopeSchema(PageContentSchema);

/**
 * Laravel `GET /api/page-contents` uç noktasını yansıtır. Sitedeki her
 * sayfa/bölüm metnini tek bir istekte döner; Next.js'in fetch önbelleği bu
 * isteği aynı render turunda çağıran her bileşen için otomatik olarak
 * tekilleştirir (`lib/api/http.ts`teki `next: { tags }`), bu yüzden her
 * bölüm bileşeni kendi ihtiyacı olan bloğu doğrudan çağırabilir.
 */
export async function fetchPageContent(): Promise<PageContent> {
  if (!isApiConfigured()) {
    return mockPageContent;
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/page-contents", PageContentResponseSchema, {
        tags: ["page-content"],
      });
      return response.data;
    },
    mockPageContent,
    "sayfa içerikleri",
  );
}

/** Tek bir bloğu okumak isteyen bileşenler için kısayol. */
export async function fetchPageContentBlock<Key extends PageContentKey>(key: Key): Promise<PageContent[Key]> {
  const pageContent = await fetchPageContent();
  return pageContent[key];
}
