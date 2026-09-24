import Link from "next/link";
import { Megaphone } from "lucide-react";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatAnnouncementCategoryLabel, formatDateLabel } from "@/lib/format";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import type { Announcement } from "@/lib/schemas/announcement";

/** Editoryal duyuru listesi — kart değil, ince ayraçlı büyük tipografi satırları. */
export async function AnnouncementStrip({ announcements }: { announcements: Announcement[] }) {
  const recentAnnouncements = announcements.slice(0, 3);
  const content = await fetchPageContentBlock("home.announcements_section");

  return (
    <section className="bg-paper py-16 sm:py-20 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <Link href="/duyurular" className="hover-bar text-sm font-bold text-navy-800">
            {content.linkLabel}
          </Link>
        </div>

        {recentAnnouncements.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={Megaphone} title={content.emptyTitle} description={content.emptyDescription} />
          </div>
        ) : (
          <ul className="mt-10 border-t border-border">
            {recentAnnouncements.map((announcement, index) => (
              <Reveal key={announcement.id} as="li" delaySeconds={index * 0.06} className="group border-b border-border">
                <Link
                  href={`/duyurular/${announcement.slug}`}
                  className="flex items-center justify-between gap-4 py-5 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-2 sm:gap-6 sm:py-7"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide text-navy-600 uppercase">
                      {formatAnnouncementCategoryLabel(announcement.category)} · {formatDateLabel(announcement.publishedAt)}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-ink">{announcement.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{announcement.excerpt}</p>
                  </div>
                  <ArrowBadge className="hidden sm:inline-flex" />
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
