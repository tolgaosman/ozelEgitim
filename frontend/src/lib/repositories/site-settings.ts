import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createResourceEnvelopeSchema } from "@/lib/schemas/common";
import { SiteSettingsSchema, type SiteSettings, type SiteStat } from "@/lib/schemas/site-settings";
import { mockSiteSettings } from "@/mocks/site-settings";

const SiteSettingsResponseSchema = createResourceEnvelopeSchema(SiteSettingsSchema);

/**
 * Laravel `GET /api/site-settings` uç noktasını yansıtır. Backend devrede
 * değilse (veya erişilemezse) `src/lib/seo/constants.ts` tabanlı yer tutucu
 * veriye düşer — iletişim bilgileri hiçbir koşulda kaybolmaz.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isApiConfigured()) {
    return mockSiteSettings;
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/site-settings", SiteSettingsResponseSchema, {
        tags: ["site-settings"],
      });
      return sortStatsByOrder(response.data);
    },
    mockSiteSettings,
    "site ayarları",
  );
}

function sortStatsByOrder(siteSettings: SiteSettings): SiteSettings {
  return {
    ...siteSettings,
    stats: [...siteSettings.stats].sort(
      (firstStat: SiteStat, secondStat: SiteStat) => firstStat.sortOrder - secondStat.sortOrder,
    ),
  };
}
