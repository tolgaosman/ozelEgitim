import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { formatAnnouncementCategoryLabel, formatDateLabel } from "@/lib/format";
import { fetchAnnouncementCollection } from "@/lib/repositories/announcements";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.announcements");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/duyurular" } };
}

export default async function AnnouncementsPage() {
  const [hero, announcements, announcementsSection] = await Promise.all([
    fetchPageContentBlock("announcements.hero"),
    fetchAnnouncementCollection(),
    fetchPageContentBlock("home.announcements_section"),
  ]);

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Duyurular" }]}
        image={hero.image}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          {!announcements.length ? (
            <EmptyState
              icon={Megaphone}
              title={announcementsSection.emptyTitle}
              description={announcementsSection.emptyDescription}
            />
          ) : (
            <ul className="border-t border-border">
              {announcements.map((announcement, index) => (
                <Reveal
                  key={announcement.id}
                  as="li"
                  delaySeconds={Math.min(index * 0.05, 0.2)}
                  className="group border-b border-border"
                >
                  <Link
                    href={`/duyurular/${announcement.slug}`}
                    className="flex items-center justify-between gap-4 py-6 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-2 sm:gap-6 sm:py-8"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-wide text-navy-600 uppercase">
                        {formatAnnouncementCategoryLabel(announcement.category)} ·{" "}
                        {formatDateLabel(announcement.publishedAt)}
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                        {announcement.title}
                      </h2>
                      <p className="mt-2.5 max-w-2xl lg:max-w-none text-base text-ink-soft">
                        {announcement.excerpt}
                      </p>
                    </div>
                    <ArrowBadge className="hidden sm:inline-flex" />
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
