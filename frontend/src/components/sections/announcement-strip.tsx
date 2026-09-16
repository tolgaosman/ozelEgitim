import Link from "next/link";
import { Megaphone } from "lucide-react";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatAnnouncementCategoryLabel, formatDateLabel } from "@/lib/format";
import type { Announcement } from "@/lib/schemas/announcement";

/** Editoryal duyuru listesi — kart değil, ince ayraçlı büyük tipografi satırları. */
export function AnnouncementStrip({ announcements }: { announcements: Announcement[] }) {
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Güncel" title="Duyurular ve Etkinlikler" />
          <Link href="/duyurular" className="text-sm font-semibold text-clay-600 hover:underline">
            Tüm duyuruları görüntüle →
          </Link>
        </div>

        {recentAnnouncements.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Megaphone}
              title="Henüz duyuru bulunmuyor"
              description="Yeni duyurular yayımlandığında burada listelenecektir."
            />
          </div>
        ) : (
          <ul className="mt-10 border-t border-border">
            {recentAnnouncements.map((announcement, index) => (
              <Reveal key={announcement.id} delaySeconds={index * 0.06}>
                <li className="group border-b border-border">
                  <Link
                    href={`/duyurular/${announcement.slug}`}
                    className="flex items-center justify-between gap-6 py-7 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-2"
                  >
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-clay-600">
                        {formatAnnouncementCategoryLabel(announcement.category)} · {formatDateLabel(announcement.publishedAt)}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">{announcement.title}</h3>
                      <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{announcement.excerpt}</p>
                    </div>
                    <ArrowBadge className="hidden sm:inline-flex" />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
