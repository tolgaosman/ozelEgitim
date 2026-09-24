import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Figtree } from "next/font/google";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminGet } from "@/lib/admin/client";
import type { DashboardSummary } from "@/lib/admin/types";
import "@/app/globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s — Yönetim Paneli" },
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

type AdminMeResponse = { data: { name: string; email: string } };
type AdminDashboardResponse = { data: DashboardSummary };

/**
 * `(protected)` route group'u bilinçli: `/admin/giris` kendi ayrı kök
 * layout'una sahiptir (`app/admin/giris/layout.tsx`) ve BU layout'un
 * dışındadır — giriş ekranı yönetim kabuğunu (sidebar, çıkış butonu) hiç
 * görmez, burada yapılan `adminGet` çağrısı orada hiç tetiklenmez.
 *
 * Gerçek oturum doğrulaması burada olur: `adminGet` 401 aldığında
 * `/admin/giris`'e yönlendirir (bkz. `lib/admin/client.ts`). `src/proxy.ts`
 * yalnızca çerezin VARLIĞINI kontrol eden hızlı bir ön kapıdır.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [me, dashboard] = await Promise.all([
    adminGet<AdminMeResponse>("/api/admin/me"),
    adminGet<AdminDashboardResponse>("/api/admin/dashboard"),
  ]);

  return (
    <html lang="tr" className={figtree.variable}>
      <body className="bg-paper font-sans text-ink">
        <AdminShell adminName={me.data.name} newInquiriesCount={dashboard.data.counts.newInquiries}>
          {children}
        </AdminShell>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
