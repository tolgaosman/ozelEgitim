import { BookOpenCheck, HeartHandshake, TrendingUp } from "lucide-react";
import { BlobImage } from "@/components/shared/blob-image";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const pillars = [
  {
    icon: BookOpenCheck,
    title: "Bilime Dayalı, Bireysel Program",
    description:
      "Her çocuk için RAM raporu ve klinik değerlendirmeyle şekillenen, düzenli olarak gözden geçirilen bir eğitim planı hazırlıyoruz.",
  },
  {
    icon: HeartHandshake,
    title: "Aileyle Birlikte Yürüyen Süreç",
    description:
      "Veliler sürecin bir parçasıdır. Düzenli görüşmeler, ev programları ve atölyelerle öğrenilen becerilerin kalıcılaşmasını sağlıyoruz.",
  },
  {
    icon: TrendingUp,
    title: "Ölçülebilir, Gözle Görülür İlerleme",
    description:
      "İlerleme, her dönem somut gözlem verileriyle paylaşılır; hedefler çocuğun gelişimine göre yeniden şekillenir.",
  },
];

/** Asimetrik anlatı bölmesi: solda organik maskeli fotoğraf, sağda numaralandırılmış ilkeler. */
export function ApproachPillars() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <Reveal>
            <BlobImage
              src="/images/approach.jpg"
              alt=""
              className="aspect-[4/5] w-full max-w-md"
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </Reveal>

          <div>
            <SectionHeading eyebrow="Yaklaşımımız" title="İz'i benzersiz kılan üç ilke" />

            <ol className="mt-10 space-y-8 border-l border-border pl-8">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delaySeconds={index * 0.08}>
                  <li className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 -left-4 flex size-8 items-center justify-center rounded-full bg-clay-600 font-display text-sm text-white"
                    >
                      {index + 1}
                    </span>
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                      <pillar.icon className="size-5 shrink-0 text-sage-600" aria-hidden="true" />
                      {pillar.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{pillar.description}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
