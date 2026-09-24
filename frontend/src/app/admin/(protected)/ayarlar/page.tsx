import { PasswordForm } from "@/components/admin/settings/password-form";
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form";
import { StatsManager } from "@/components/admin/settings/stats-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminGet } from "@/lib/admin/client";
import type { AdminSiteSettings } from "@/lib/admin/types";

export const metadata = { title: "Ayarlar" };

export default async function AdminSettingsPage() {
  const { data: settings } = await adminGet<{ data: AdminSiteSettings }>("/api/admin/site-settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Ayarlar</h1>
        <p className="mt-1 text-sm text-ink-soft">İletişim bilgileri, çalışma saatleri, sayaçlar ve hesap güvenliği.</p>
      </div>

      <Tabs defaultValue="iletisim">
        <TabsList>
          <TabsTrigger value="iletisim">İletişim</TabsTrigger>
          <TabsTrigger value="istatistikler">İstatistikler</TabsTrigger>
          <TabsTrigger value="guvenlik">Güvenlik</TabsTrigger>
        </TabsList>

        <TabsContent value="iletisim" className="mt-6">
          <SiteSettingsForm settings={settings} />
        </TabsContent>

        <TabsContent value="istatistikler" className="mt-6">
          <StatsManager initialStats={settings.stats} />
        </TabsContent>

        <TabsContent value="guvenlik" className="mt-6">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
