import type { NextConfig } from "next";

/**
 * Yönetim panelinden yüklenen görseller Laravel'in `storage` diskinden
 * servis edilir; `next/image` bu host'u açıkça tanımak zorundadır.
 *
 * Host, backend'in taban adresinden türetilir — böylece tek bir `API_BASE_URL`
 * değişkeni hem API isteklerini hem görsel kaynaklarını yapılandırır ve iki
 * yerde birbirinden sapan bir adres tutmak gerekmez. Değişken tanımlı
 * değilse (yerel geliştirmede backend'siz çalışma) uzak görsel de yoktur.
 */
const apiBaseUrl = process.env.API_BASE_URL;

/**
 * Yerelde `localhost` ve `127.0.0.1` birbirinin yerine geçebiliyor (backend
 * `APP_URL` biriyle, `API_BASE_URL` diğeriyle ayarlanabiliyor) — bu yüzden
 * `API_BASE_URL`'in host'u ne olursa olsun ikisi birden izin listesine
 * eklenir, aksi halde tek bir ortam değişkeni yanlış yazılınca yüklenen
 * görseller sitede sessizce kırılır.
 */
function buildRemoteImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  if (!apiBaseUrl) {
    return [];
  }

  try {
    const { protocol, hostname, port } = new URL(apiBaseUrl);
    const resolvedProtocol = protocol.replace(":", "") as "http" | "https";
    const hostnames = hostname === "localhost" || hostname === "127.0.0.1" ? ["localhost", "127.0.0.1"] : [hostname];

    return hostnames.map((patternHostname) => ({
      protocol: resolvedProtocol,
      hostname: patternHostname,
      port,
      pathname: "/storage/**",
    }));
  } catch {
    // Geçersiz bir URL yüzünden build'i kırmayız; yalnızca uzak görsel
    // desteği devre dışı kalır ve site yer tutucu görsellerle çalışır.
    console.warn(`[next.config] API_BASE_URL geçerli bir URL değil: ${apiBaseUrl}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  // Next 16 geliştirmede localhost dışı origin'lerden gelen `/_next/*` ve HMR
  // isteklerini engeller; siteyi telefondan LAN IP'siyle açınca JS yüklenmez,
  // sayfa hydrate olmaz ve boş görünür. Yerel ağ adreslerine izin veriyoruz.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  images: {
    remotePatterns: buildRemoteImagePatterns(),
    // Yerelde backend'in kendisi bir local IP/host üzerinden servis edildiği
    // için optimizasyon devre dışı kalmasın diye yalnız geliştirmede açılır.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  experimental: {
    // Site (`(site)`) ve panel (`admin`) ayrı kök layout'lara sahip — tek bir
    // layout'tan kurulan sıradan bir `not-found.tsx` her ikisini de kapsayamaz.
    // `global-not-found.tsx` eşleşmeyen HER yol için markalı 404'ü gösterir.
    globalNotFound: true,
    // Panel görselleri Server Action (`uploadMediaAction`) üzerinden geçer;
    // varsayılan 1 MB sınırı telefon fotoğraflarını Laravel'e ulaşmadan keser.
    // Backend 4 MB'a izin verir, multipart payı için biraz üstü.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
