import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { resolveProgramImage } from "@/lib/program-images";
import { fetchProgramBySlug, fetchProgramCollection } from "@/lib/repositories/programs";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const programs = await fetchProgramCollection();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await fetchProgramBySlug(slug);

  if (!program) return { title: "Program Bulunamadı" };

  return {
    title: program.name,
    description: program.shortDescription,
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await fetchProgramBySlug(slug);

  if (!program) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-ink" data-scrim>
        <Image src={resolveProgramImage(program.slug)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="scrim-full absolute inset-0" aria-hidden="true" />
        <Container className="relative py-24 lg:py-32">
          <Breadcrumbs
            tone="dark"
            items={[{ label: "Programlarımız", href: "/programlar" }, { label: program.name }]}
          />
          <h1 className="mt-6 max-w-3xl text-display-lg font-display text-white">{program.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{program.shortDescription}</p>
        </Container>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <Prose paragraphs={program.description} />
              </Reveal>
            </div>

            <Reveal delaySeconds={0.08}>
              <aside className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <div>
                  <p className="text-xs font-medium text-ink-faint">Yaş Aralığı</p>
                  <p className="mt-1 text-sm font-medium text-ink">{program.ageRangeLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink-faint">Seans Formatı</p>
                  <p className="mt-1 text-sm font-medium text-ink">{program.sessionFormatLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink-faint">Programın Öne Çıkanları</p>
                  <ul className="mt-2 space-y-2">
                    {program.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-ink-soft">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage-600" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="h-auto w-full py-2.5 whitespace-normal" render={<Link href="/kayit" />}>
                  Bu Program İçin Görüşme Talep Edin
                </Button>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
