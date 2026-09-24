import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Yeni Duyuru" };

export default async function NewAnnouncementPage() {
  const { data: meta } = await adminGet<{ data: AdminMeta }>("/api/admin/meta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Duyuru</h1>
        <p className="mt-1 text-sm text-ink-soft">Yeni bir duyuru veya etkinlik yazısı ekleyin.</p>
      </div>
      <AnnouncementForm categories={meta.announcementCategories} />
    </div>
  );
}
