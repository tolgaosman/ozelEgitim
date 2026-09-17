import type { Metadata, Viewport } from "next";
import { Figtree, Atkinson_Hyperlegible } from "next/font/google";
import { AccessibleNavbar } from "@/components/layout/accessible-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { MotionProvider } from "@/components/shared/motion-provider";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import "./globals.css";

/**
 * Sitenin tek yazı ailesi — hem gövde hem başlık. Referans site (Scandia)
 * gibi geometrik-hümanist bir sans; Figtree onun en yakın ücretsiz karşılığı
 * ve latin-ext alt kümesiyle Türkçe karakterleri tam karşılar. Değişken font
 * olduğu için 300-900 arası tüm ağırlıklar tek dosyadan gelir; başlıklardaki
 * 800 ağırlık ayrı bir istek doğurmaz.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/assets/browserLogo.png',
  },
  title: {
    default: `${SITE_NAME} — Özel Eğitim ve Rehabilitasyon Merkezi`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "İz Özel Eğitim Merkezi; otizm spektrum bozukluğu, özel öğrenme güçlüğü, dil-konuşma ve gelişimsel destek ihtiyacı olan çocuklar için bireyselleştirilmiş eğitim programları sunar.",
  keywords: [
    "özel eğitim merkezi",
    "otizm destek eğitimi",
    "dil ve konuşma terapisi",
    "özel öğrenme güçlüğü",
    "RAM raporu",
    "duyu bütünleme terapisi",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1b3d",
  width: "device-width",
  initialScale: 1,
};

/**
 * Erişilebilirlik tercihlerini (yazı boyutu, kontrast, yazı tipi, hareket)
 * ilk boyamadan önce senkron olarak uygular. Bu script, kullanıcının bir
 * önceki ziyaretten kalan tercihi görene kadar geçen sürede yanlış temanın
 * görünüp sonra değişmesini (FOUC) engeller. Yalnızca localStorage okur,
 * hiçbir ağ isteği veya kullanıcı verisi işlemez.
 */
const ACCESSIBILITY_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var STORAGE_KEY = "iz-accessibility-preferences";
    var storedPreferences = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    var documentElement = document.documentElement;
    if (storedPreferences.textScale) documentElement.setAttribute("data-text-scale", storedPreferences.textScale);
    if (storedPreferences.contrast) documentElement.setAttribute("data-contrast", storedPreferences.contrast);
    if (storedPreferences.font) documentElement.setAttribute("data-font", storedPreferences.font);
    if (storedPreferences.motion) documentElement.setAttribute("data-motion", storedPreferences.motion);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !storedPreferences.motion) {
      documentElement.setAttribute("data-motion", "reduced");
    }
  } catch (bootstrapError) {
    /* localStorage erişilemezse sessizce varsayılan temaya devam edilir */
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${figtree.variable} ${atkinsonHyperlegible.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ACCESSIBILITY_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <SkipToContent />
          <AccessibleNavbar />
          <main id="ana-icerik" className="flex-1 overflow-x-clip">
            {children}
          </main>
          <SiteFooter />
          <FloatingWhatsapp />
        </MotionProvider>
      </body>
    </html>
  );
}
