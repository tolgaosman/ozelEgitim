import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
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
      <section className="relative overflow-hidden bg-navy-900" data-scrim>
        <Image src={resolveProgramImage(program.slug, program.image)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="scrim-full absolute inset-0" aria-hidden="true" />
        <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-32">
          <Breadcrumbs
            tone="dark"
            items={[{ label: "Programlarımız", href: "/programlar" }, { label: program.name }]}
          />
          <h1 className="mt-6 max-w-3xl text-display-lg font-display font-bold text-white">{program.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{program.shortDescription}</p>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32 relative">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Sol Kolon: Ana İçerik */}
            <div className="space-y-12 lg:col-span-8 sm:space-y-16">
              {/* Editoryal Metin Alanı */}
              <Reveal>
                <div className="space-y-5 sm:space-y-6">
                  {program.description.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? "border-l-4 border-signal pl-5 text-xl font-medium leading-relaxed tracking-tight text-navy-900 sm:text-2xl lg:leading-snug"
                          : "text-base leading-relaxed text-ink-soft sm:text-lg"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Öne Çıkanlar (Highlights Grid) */}
              <Reveal delaySeconds={0.1}>
                <div>
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Programın Öne Çıkan Özellikleri
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {program.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="group flex flex-col items-start gap-4 rounded-2xl border border-transparent bg-paper p-6 transition-all duration-300 hover:border-aqua-200 hover:bg-white hover:shadow-[var(--shadow-card)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-aqua-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <CheckCircle2 className="size-5" aria-hidden="true" />
                          </span>
                          <h4 className="font-bold text-navy-900">{highlight.title}</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-soft">
                          {highlight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Sağ Kolon: Sticky Sidebar */}
            <Reveal delaySeconds={0.15} className="lg:col-span-4">
              <aside className="sticky top-32 space-y-8 rounded-3xl bg-navy-900 p-8 shadow-2xl overflow-hidden relative">
                {/* Dekoratif Arka Plan Şekli */}
                <div className="absolute -right-12 -top-12 size-40 rounded-full bg-navy-800 blur-2xl opacity-50 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="mb-8 font-display text-sm font-extrabold uppercase tracking-widest text-white/90">
                    Program Detayları
                  </h3>
                  <dl className="space-y-6">
                    <div className="flex flex-col gap-1.5 border-b border-white/10 pb-6">
                      <dt className="text-xs font-bold text-white/50 uppercase tracking-widest">Yaş Aralığı</dt>
                      <dd className="text-lg font-medium text-white">{program.ageRangeLabel}</dd>
                    </div>
                    <div className="flex flex-col gap-1.5 pb-2">
                      <dt className="text-xs font-bold text-white/50 uppercase tracking-widest">Seans Formatı</dt>
                      <dd className="text-lg font-medium text-white">{program.sessionFormatLabel}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="relative z-10 pt-4">
                  <Button 
                    size="pill" 
                    className="w-full text-sm sm:text-base bg-signal hover:bg-signal/90 text-white border-transparent shadow-lg shadow-signal/20 transition-all hover:-translate-y-1" 
                    render={<Link href={`/iletisim?program=${program.slug}`} />}
                  >
                    Ön Görüşme Talep Edin
                  </Button>
                </div>
              </aside>
            </Reveal>

          </div>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
