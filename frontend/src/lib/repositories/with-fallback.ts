import "server-only";
import { ApiError } from "@/lib/api/http";

/**
 * Laravel'e yapılan bir isteği sarmalar; istek başarısız olursa (ağ hatası,
 * zaman aşımı, 5xx veya şema sapması) yer tutucu veriye düşer ve sunucu
 * günlüğüne yazar.
 *
 * Neden: `API_BASE_URL` tanımlıyken `fetchJson` hata fırlatır ve bu hata
 * Server Component'i çökertip tüm sayfayı `error.tsx`'e düşürürdü. Kurumsal
 * bir sitede backend'in kısa süreli erişilemezliği yüzünden iletişim
 * bilgilerinin bile görünmemesi kabul edilebilir değil; bu yüzden site
 * ayakta kalır, içerik geçici olarak yer tutucuya döner.
 *
 * Bilinçli ödünleşim: hata sessizce yutulduğu için ziyaretçi eski/yer tutucu
 * içerik görebilir. Bu yüzden her düşüş `console.error` ile raporlanır —
 * üretimde bu kayıtlar izlenmelidir.
 */
export async function resolveWithFallback<Records>(
  fetchOperation: () => Promise<Records>,
  fallbackRecords: Records,
  sourceLabel: string,
): Promise<Records> {
  try {
    return await fetchOperation();
  } catch (failureReason) {
    reportFallback(sourceLabel, failureReason);
    return fallbackRecords;
  }
}

/**
 * Tekil kayıt (slug ile arama) için `resolveWithFallback` varyantı.
 *
 * Aradaki kritik fark: **404 bir kesinti değil, backend'in kesin cevabıdır** —
 * "böyle bir kayıt yok". Bu durumda yer tutucuya düşmek, panelden silinmiş
 * bir programı sitede yaşatmaya devam ederdi. Bu yüzden 404 doğrudan `null`
 * döner ve sayfa `not-found` durumuna geçer; yalnızca gerçek erişim
 * sorunlarında yer tutucu kayda düşülür.
 */
export async function resolveRecordWithFallback<RecordShape>(
  fetchOperation: () => Promise<RecordShape | null>,
  fallbackRecord: RecordShape | null,
  sourceLabel: string,
): Promise<RecordShape | null> {
  try {
    return await fetchOperation();
  } catch (failureReason) {
    if (failureReason instanceof ApiError && failureReason.status === 404) {
      return null;
    }

    reportFallback(sourceLabel, failureReason);
    return fallbackRecord;
  }
}

/**
 * Geliştirmede backend'in hiç çalışmıyor olması (bağlantı reddi, zaman aşımı)
 * beklenen bir durumdur; `console.error` her düşüşü Next.js geliştirme
 * katmanında ayrı bir "issue" olarak saydığı için bu durum uyarı düzeyinde
 * raporlanır. Backend'in verdiği hatalı yanıtlar (5xx, şema sapması) her
 * ortamda gerçek bir sorundur ve hata olarak kalır.
 */
function reportFallback(sourceLabel: string, failureReason: unknown): void {
  const failureDetail =
    failureReason instanceof ApiError
      ? `${failureReason.message}${failureReason.status ? ` (HTTP ${failureReason.status})` : ""}`
      : String(failureReason);

  const message = `[api] ${sourceLabel} çekilemedi, yer tutucu veriye düşülüyor: ${failureDetail}`;
  const isUnreachableInDevelopment =
    process.env.NODE_ENV === "development" && !(failureReason instanceof ApiError);

  if (isUnreachableInDevelopment) {
    console.warn(message);
    return;
  }

  console.error(message);
}
