import "server-only";
import { headers } from "next/headers";

/**
 * Next.js server action'ları Laravel API'sini sunucudan sunucuya çağırır; bu
 * yüzden Laravel'e ulaşan bağlantı her zaman Next sunucusunundur ve
 * `throttle:*` hız sınırlamaları ile `inquiries.ip_hash` gerçek ziyaretçiyi
 * değil Next sunucusunu görür. Gerçek ziyaretçi IP'si yalnızca gelen isteğin
 * üzerindeki `x-forwarded-for` (barındırma sağlayıcısının önündeki vekil
 * sunucu tarafından eklenir) ya da `x-real-ip` başlığından okunabilir.
 */
export async function resolveClientIp(): Promise<string | null> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    // Standart kural: her vekil sunucu kendi gördüğü IP'yi listenin SONUNA
    // ekler. Next'in önündeki barındırma sağlayıcısının eklediği en güvenilir
    // değer bu yüzden SON girdidir — ilk girdi ziyaretçinin kendisi
    // tarafından serbestçe ayarlanabilen, güvenilmez bir değerdir.
    const hops = forwardedFor.split(",").map((hop) => hop.trim()).filter(Boolean);
    const closestHop = hops.at(-1);
    if (closestHop) return closestHop;
  }

  return headerList.get("x-real-ip");
}
