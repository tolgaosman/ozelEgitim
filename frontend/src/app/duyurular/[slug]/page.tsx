import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";
import { Reveal } from "@/components/shared/reveal";
import { formatAnnouncementCategoryLabel, formatDateLabel } from "@/lib/format";
import { fetchAnnouncementBySlug, fetchAnnouncementCollection } from "@/lib/repositories/announcements";

type AnnouncementDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const announcements = await fetchAnnouncementCollection();
  return announcements.map((announcement) => ({ slug: announcement.slug }));
}

export async function generateMetadata({ params }: AnnouncementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await fetchAnnouncementBySlug(slug);

  if (!announcement) return { title: "Duyuru Bulunamadı" };

  return {
    title: announcement.title,
    description: announcement.excerpt,
  };
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { slug } = await params;
  const announcement = await fetchAnnouncementBySlug(slug);

  if (!announcement) notFound();

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container width="prose">
        <Breadcrumbs items={[{ label: "Duyurular", href: "/duyurular" }, { label: announcement.title }]} />

        <Reveal>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-clay-50 px-3 py-1 text-xs font-medium text-clay-700">
            {formatAnnouncementCategoryLabel(announcement.category)}
          </p>
          <h1 className="mt-3 font-display text-display-md text-balance text-ink">{announcement.title}</h1>
          <p className="mt-2 text-sm text-ink-faint">{formatDateLabel(announcement.publishedAt)}</p>

          <div className="mt-8">
            <Prose paragraphs={announcement.body} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
