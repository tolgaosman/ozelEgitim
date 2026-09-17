import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Laravel yönetim panelinde içerik kaydedildiğinde çağrılır ve ilgili ISR
 * önbellek etiketlerini geçersiz kılar. Bu uç nokta olmadan değişiklikler
 * `revalidate: 300` süresi dolana kadar sitede görünmez.
 *
 * Güvenlik (Rule 03):
 *  - Paylaşılan gizli anahtar sabit zamanlı karşılaştırılır (zamanlama sızıntısı yok).
 *  - Etiketler beyaz listeye karşı doğrulanır; rastgele bir etiketle
 *    önbelleğin tamamı boşaltılamaz.
 *  - Gövde Zod ile doğrulanır.
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

/**
 * İzin verilen etiketler. Koleksiyon etiketleri tam eşleşme, tekil kayıt
 * etiketleri `<önek>:<slug>` biçiminde önek eşleşmesiyle kabul edilir.
 * Bu liste Laravel modellerindeki FRONTEND_COLLECTION_TAG /
 * FRONTEND_RECORD_TAG_PREFIX sabitleriyle birebir aynı olmalıdır.
 */
const ALLOWED_COLLECTION_TAGS = new Set([
  "programs",
  "announcements",
  "staff-members",
  "faqs",
  "testimonials",
  "site-settings",
]);

const ALLOWED_RECORD_TAG_PREFIXES = new Set(["program", "announcement"]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

const RevalidateRequestSchema = z.object({
  tags: z.array(z.string().min(1).max(200)).min(1).max(50),
});

export async function POST(request: Request): Promise<NextResponse> {
  if (!REVALIDATE_SECRET) {
    // Anahtar tanımlı değilse uç nokta tamamen kapalıdır — yapılandırma
    // eksikken herkese açık bir önbellek temizleme kapısı bırakmayız.
    return NextResponse.json({ message: "Tazeleme uç noktası yapılandırılmamış." }, { status: 503 });
  }

  const providedSecret = request.headers.get("x-revalidate-secret");

  if (!providedSecret || !isSecretValid(providedSecret, REVALIDATE_SECRET)) {
    return NextResponse.json({ message: "Yetkisiz istek." }, { status: 401 });
  }

  const parsedBody = RevalidateRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 422 });
  }

  const acceptedTags = parsedBody.data.tags.filter(isTagAllowed);

  for (const cacheTag of acceptedTags) {
    // Next.js 16'da ikinci argüman zorunludur ve bayat içeriğin arka planda
    // tazelenirken ne kadar süre servis edilebileceğini belirler. `"max"`
    // (dokümanların önerisi) ziyaretçiyi hiç bekletmez: ilk istek bayat
    // içeriği alır ve tazelemeyi tetikler, sonraki istek güncel içeriği görür.
    // `updateTag` anında geçersiz kılardı ama yalnızca Server Action'larda
    // kullanılabiliyor — burası bir Route Handler.
    revalidateTag(cacheTag, "max");
  }

  return NextResponse.json({ revalidated: acceptedTags });
}

/**
 * Sabit zamanlı karşılaştırma. `timingSafeEqual` eşit olmayan uzunluktaki
 * arabellekler için hata fırlattığından, uzunluk farkı önce ayrıca elenir —
 * bu, gizli anahtarın uzunluğu dışında hiçbir bilgi sızdırmaz.
 */
function isSecretValid(providedSecret: string, expectedSecret: string): boolean {
  const providedBytes = Buffer.from(providedSecret, "utf8");
  const expectedBytes = Buffer.from(expectedSecret, "utf8");

  if (providedBytes.length !== expectedBytes.length) {
    return false;
  }

  return timingSafeEqual(providedBytes, expectedBytes);
}

function isTagAllowed(cacheTag: string): boolean {
  if (ALLOWED_COLLECTION_TAGS.has(cacheTag)) {
    return true;
  }

  const separatorIndex = cacheTag.indexOf(":");
  if (separatorIndex === -1) {
    return false;
  }

  const tagPrefix = cacheTag.slice(0, separatorIndex);
  const tagSlug = cacheTag.slice(separatorIndex + 1);

  return ALLOWED_RECORD_TAG_PREFIXES.has(tagPrefix) && SLUG_PATTERN.test(tagSlug);
}
