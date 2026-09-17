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

function buildRemoteImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  if (!apiBaseUrl) {
    return [];
  }

  try {
    const { protocol, hostname, port } = new URL(apiBaseUrl);

    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/**",
      },
    ];
  } catch {
    // Geçersiz bir URL yüzünden build'i kırmayız; yalnızca uzak görsel
    // desteği devre dışı kalır ve site yer tutucu görsellerle çalışır.
    console.warn(`[next.config] API_BASE_URL geçerli bir URL değil: ${apiBaseUrl}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemoteImagePatterns(),
  },
};

export default nextConfig;
