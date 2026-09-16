import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { formatAnnouncementCategoryLabel, formatDateLabel } from "@/lib/format";
import { fetchAnnouncementCollection } from "@/lib/repositories/announcements";

export const metadata: Metadata = {
  title: "Duyurular",
  description: "İz Özel Eğitim Merkezi'nden güncel duyurular ve etkinlikler.",
};

export default async function AnnouncementsPage() {
  const announcements = await fetchAnnouncementCollection();
  const [featuredAnnouncement, ...remainingAnnouncements] = announcements;

  return (
    <>
      <PageHero
        title="Duyurular"
        description="Kayıt dönemleri, etkinlikler ve merkezimizdeki gelişmelerden haberdar olun."
        breadcrumbItems={[{ label: "Duyurular" }]}
        image="/images/hero-admissions.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          {!featuredAnnouncement ? (
            <EmptyState
              icon={Megaphone}
              title="Henüz duyuru bulunmuyor"
              description="Yeni duyurular yayımlandığında burada listelenecektir."
            />
          ) : (
            <>
              <Reveal>
                <Link
                  href={`/duyurular/${featuredAnnouncement.slug}`}
                  className="group grid grid-cols-1 gap-8 overflow-hidden rounded-[1.75rem] border border-border shadow-[var(--shadow-card)] lg:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] w-full lg:aspect-auto">
                    <Image
                      src="/images/cta-band.jpg"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-8 lg:p-10">
                    <p className="text-xs font-semibold tracking-wide text-clay-600">
                      {formatAnnouncementCategoryLabel(featuredAnnouncement.category)} ·{" "}
                      {formatDateLabel(featuredAnnouncement.publishedAt)}
                    </p>
                    <h2 className="font-display text-display-md text-ink">{featuredAnnouncement.title}</h2>
                    <p className="max-w-xl text-base leading-relaxed text-ink-soft">
                      {featuredAnnouncement.excerpt}
                    </p>
                    <ArrowBadge className="mt-2" />
                  </div>
                </Link>
              </Reveal>

              {remainingAnnouncements.length > 0 ? (
                <ul className="mt-16 border-t border-border">
                  {remainingAnnouncements.map((announcement, index) => (
                    <Reveal key={announcement.id} delaySeconds={Math.min(index * 0.05, 0.2)}>
                      <li className="group border-b border-border">
                        <Link
                          href={`/duyurular/${announcement.slug}`}
                          className="flex items-center justify-between gap-6 py-7 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-2"
                        >
                          <div>
                            <p className="text-xs font-semibold tracking-wide text-clay-600">
                              {formatAnnouncementCategoryLabel(announcement.category)} ·{" "}
                              {formatDateLabel(announcement.publishedAt)}
                            </p>
                            <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">
                              {announcement.title}
                            </h3>
                            <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{announcement.excerpt}</p>
                          </div>
                          <ArrowBadge className="hidden sm:inline-flex" />
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
