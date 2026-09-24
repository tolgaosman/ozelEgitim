import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Figtree } from "next/font/google";
import "@/app/globals.css";

/**
 * `/admin/giris` kendi kök layout'udur (bkz. `app/admin/(protected)/layout.tsx`
 * ile aynı desen) — kimliği doğrulanmamış bir ziyaretçi yönetim kabuğunu
 * (sidebar, çıkış butonu) HİÇ görmemelidir, bu yüzden bilinçli olarak ayrı
 * bir dal olarak tutulur.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Giriş — Yönetim Paneli",
  icons: {
    icon: "/assets/browserLogo.png",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1533",
  width: "device-width",
  initialScale: 1,
};

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={figtree.variable}>
      <body className="min-h-svh bg-navy-900 font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
