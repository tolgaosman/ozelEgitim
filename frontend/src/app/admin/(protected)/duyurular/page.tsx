import Image from "next/image";
import Link from "next/link";
import { Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { adminGet } from "@/lib/admin/client";
import { deleteAnnouncementAction, reorderAnnouncementsAction, restoreAnnouncementAction } from "@/lib/admin/actions/announcements";
import { swapAdjacentIds } from "@/lib/admin/reorder";
import type { AdminAnnouncement } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";

export const metadata = { title: "Duyurular" };

export default async function AdminAnnouncementsPage() {
  const { data: announcements } = await adminGet<{ data: AdminAnnouncement[] }>("/api/admin/announcements");
  const activeAnnouncements = announcements.filter((item) => !item.deletedAt);
  const trashedAnnouncements = announcements.filter((item) => item.deletedAt);
  const orderedIds = activeAnnouncements.map((item) => item.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Duyurular</h1>
          <p className="mt-1 text-sm text-ink-soft">Sitedeki duyuru ve etkinlik yazıları.</p>
        </div>
        <Button render={<Link href="/admin/duyurular/yeni" />}>
          <Plus className="size-4" />
          Yeni Duyuru
        </Button>
      </div>

      {activeAnnouncements.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Henüz duyuru eklenmemiş.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {activeAnnouncements.map((announcement, index) => (
            <li key={announcement.id} className="flex flex-wrap items-center gap-3 p-4">
              <ReorderButtons
                moveUpAction={reorderAnnouncementsAction.bind(null, swapAdjacentIds(orderedIds, index, "up"))}
                moveDownAction={reorderAnnouncementsAction.bind(null, swapAdjacentIds(orderedIds, index, "down"))}
                disableUp={index === 0}
                disableDown={index === activeAnnouncements.length - 1}
              />
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                {announcement.imageUrl ? <Image src={announcement.imageUrl} alt="" fill sizes="56px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{announcement.title}</p>
                <p className="truncate text-sm text-ink-soft">{announcement.excerpt}</p>
              </div>
              <Badge variant={announcement.isPublished ? "default" : "secondary"} className={announcement.isPublished ? "bg-grass-500/15 text-grass-600" : ""}>
                {announcement.isPublished ? "Yayında" : "Taslak"}
              </Badge>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" render={<Link href={`/admin/duyurular/${announcement.id}`} />}>
                  Düzenle
                </Button>
                <DeleteButton
                  itemLabel={announcement.title}
                  action={deleteAnnouncementAction.bind(null, announcement.id, announcement.slug)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {trashedAnnouncements.length > 0 ? (
        <div>
          <h2 className="font-display text-base font-bold text-ink">Çöp Kutusu</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
            {trashedAnnouncements.map((announcement) => (
              <li key={announcement.id} className="flex flex-wrap items-center gap-3 p-4 opacity-70">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{announcement.title}</p>
                  <p className="truncate text-xs text-ink-faint">Silindi: {formatDateLabel(announcement.deletedAt!)}</p>
                </div>
                <form action={restoreAnnouncementAction.bind(null, announcement.id, announcement.slug)}>
                  <Button type="submit" variant="outline" size="sm">
                    <RotateCcw className="size-3.5" />
                    Geri Al
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
