import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";
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

  // "Diğer Duyurular" için mevcut duyuru hariç ilk 3 duyuruyu al
  const allAnnouncements = await fetchAnnouncementCollection();
  const otherAnnouncements = allAnnouncements
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        lead="Duyuru /"
        accent="ETKİNLİK"
        breadcrumbItems={[{ label: "Duyurular", href: "/duyurular" }, { label: announcement.title }]}
        image="/images/hero-home.jpg"
      />

      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-white -z-20" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8 lg:pr-8">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-aqua-100 px-3 py-1 text-xs font-bold text-navy-800 uppercase tracking-wide">
                    {formatAnnouncementCategoryLabel(announcement.category)}
                  </span>
                  <span className="text-sm font-medium text-ink-faint">
                    {formatDateLabel(announcement.publishedAt)}
                  </span>
                </div>
                
                <h1 className="mt-5 font-display text-display-md font-bold text-balance text-navy-900 leading-tight">
                  {announcement.title}
                </h1>

              {announcement.image && (
                <div className="mt-8 relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={announcement.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="mt-8 sm:mt-12 rounded-xl bg-paper p-6 sm:p-10 border border-border">
                <Prose paragraphs={announcement.body} />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* İletişim CTA */}
              <Reveal delaySeconds={0.1}>
                <div className="rounded-xl border border-navy-800/10 bg-accent p-6 shadow-[var(--shadow-card)]">
                  <h3 className="font-display text-lg font-bold text-navy-800">Daha fazla bilgi mi gerekiyor?</h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    Bu konu veya merkezimizdeki programlar hakkında detaylı bilgi almak için bize ulaşabilirsiniz.
                  </p>
                  <Button
                    size="pill"
                    render={<Link href="/iletisim" />}
                    className="mt-6 w-full text-center bg-navy-800 hover:bg-navy-600"
                  >
                    <CalendarCheck className="size-4 mr-2" aria-hidden="true" />
                    İletişime Geçin
                  </Button>
                </div>
              </Reveal>

              {/* Diğer Duyurular */}
              {otherAnnouncements.length > 0 && (
                <Reveal delaySeconds={0.2}>
                  <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="font-display text-lg font-bold text-ink mb-4 border-b border-border pb-3">
                      Diğer Duyurular
                    </h3>
                    <ul className="space-y-4">
                      {otherAnnouncements.map((item) => (
                        <li key={item.id} className="group">
                          <Link href={`/duyurular/${item.slug}`} className="block">
                            <span className="text-[11px] font-bold tracking-wide text-navy-600 uppercase">
                              {formatAnnouncementCategoryLabel(item.category)}
                            </span>
                            <h4 className="mt-1 text-sm font-bold text-ink group-hover:text-signal transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="mt-2 flex items-center text-[13px] font-medium text-ink-soft group-hover:text-signal transition-colors">
                              İncele <ChevronRight className="ml-1 size-3" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
