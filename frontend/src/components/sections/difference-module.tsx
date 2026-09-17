import { BookOpenCheck, HeartHandshake, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/container";
import { IconFeature } from "@/components/shared/icon-feature";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";

const pillars = [
  {
    index: "01",
    icon: BookOpenCheck,
    accentColor: "aqua",
    title: "Bilime Dayalı, Bireysel Program",
    description:
      "Her çocuk için RAM raporu ve klinik değerlendirmeyle şekillenen, düzenli olarak gözden geçirilen bir eğitim planı hazırlıyoruz.",
  },
  {
    index: "02",
    icon: HeartHandshake,
    accentColor: "peach",
    title: "Aileyle Birlikte Yürüyen Süreç",
    description:
      "Veliler sürecin bir parçasıdır. Düzenli görüşmeler, ev programları ve atölyelerle öğrenilen becerilerin kalıcılaşmasını sağlıyoruz.",
  },
  {
    index: "03",
    icon: TrendingUp,
    accentColor: "grass",
    title: "Ölçülebilir, Gözle Görülür İlerleme",
    description:
      "İlerleme, her dönem somut gözlem verileriyle paylaşılır; hedefler çocuğun gelişimine göre yeniden şekillenir.",
  },
] as const;

/**
 * "Farkı Biliyoruz" bölümü — referans sitenin `module--difference`
 * karşılığı. Ortalanmış başlık ve tek paragraf, altında üç düz ikon-özellik
 * bloğu (bkz. `IconFeature`).
 */
export function DifferenceModule() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-32">
      <div className="absolute inset-0 bg-paper -z-20" />
      
      <ShapeField className="-z-10">
        <Shape color="grass" form="square" scale={0.5} className="-top-12 right-[40%]" />
        <Shape color="aqua" form="circle" scale={0.4} className="top-[8%] -left-14" />
        <Shape color="grass" form="circle" scale={0.55} className="-bottom-16 right-[14%]" />
        
        {/* Eklenen yeni şekiller */}
        <Shape color="aqua" form="square" scale={0.35} className="bottom-[35%] left-[10%] opacity-40" />
        <Shape color="peach" form="circle" scale={0.45} className="top-[45%] right-[25%] opacity-30" />
      </ShapeField>

      <Container className="relative z-10">
        <Reveal>
          <SplitTitle lead="Farkı" accent="Biliyoruz" align="center" className="mx-auto" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-ink-soft">
            Farklı büyüklüğümüz ve yaklaşımımız, her çocuğa hem birey hem öğrenci olarak
            ulaşmamızı sağlar. İz, öğrencilerimiz ve aileleri için bir okuldan çok daha
            fazlası — öğrencilerimizin uzun vadeli, bütüncül başarısına yatırım yapan
            eğitimcilerden, uzmanlardan ve bakım verenlerden oluşan bir topluluktur.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-14">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delaySeconds={index * 0.08}>
              <IconFeature
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                accentColor={pillar.accentColor}
                index={pillar.index}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
