import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminAnnouncement, AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Duyuruyu Düzenle" };

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: announcement }, { data: meta }] = await Promise.all([
    adminGet<{ data: AdminAnnouncement }>(`/api/admin/announcements/${id}`),
    adminGet<{ data: AdminMeta }>("/api/admin/meta"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{announcement.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">Duyuru bilgilerini düzenleyin.</p>
        </div>
        {announcement.isPublished ? (
          <Link
            href={`/duyurular/${announcement.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-800 hover:underline"
          >
            Sitede gör <ExternalLink className="size-3.5" />
          </Link>
        ) : null}
      </div>
      <AnnouncementForm announcement={announcement} categories={meta.announcementCategories} />
    </div>
  );
}
