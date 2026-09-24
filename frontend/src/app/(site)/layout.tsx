import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Figtree, Atkinson_Hyperlegible } from "next/font/google";
import { AccessibleNavbar } from "@/components/layout/accessible-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { MotionProvider } from "@/components/shared/motion-provider";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";
import { buildPrimaryNavigation } from "@/lib/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import "@/app/globals.css";

/**
 * Bu, halka açık sitenin KÖK layout'udur (üstünde başka `layout.tsx` yok —
 * bkz. Next.js "multiple root layouts": `app/admin/layout.tsx` kendi ayrı
 * kökü). `<html>`/`<body>`, fontlar, erişilebilirlik script'i ve gezinme/
 * footer kabuğu burada birlikte yaşar; `/admin` bu ağacın tamamen dışındadır
 * ve hiçbirini paylaşmaz.
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

export async function generateMetadata(): Promise<Metadata> {
  const seoGlobal = await fetchPageContentBlock("seo.global");

  return {
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: "/assets/browserLogo.png",
    },
    title: {
      default: seoGlobal.defaultTitle,
      template: `%s — ${SITE_NAME}`,
    },
    description: seoGlobal.description,
    keywords: seoGlobal.keywords,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
    },
  };
}

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

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [{ contact }, programs] = await Promise.all([fetchSiteSettings(), fetchProgramCollection()]);
  const primaryNavigation = buildPrimaryNavigation(programs);

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
          <AccessibleNavbar
            phoneDisplay={contact.phoneDisplay}
            phoneTel={contact.phoneTel}
            primaryNavigation={primaryNavigation}
          />
          <main id="ana-icerik" className="flex-1 overflow-x-clip">
            {children}
          </main>
          <SiteFooter />
          <FloatingWhatsapp phoneTel={contact.phoneTel} whatsappUrl={contact.whatsappUrl} />
        </MotionProvider>
      </body>
    </html>
  );
}
