import { BookOpenCheck, HeartHandshake, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

/**
 * İkon ve vurgu rengi tasarımın sabit bir parçasıdır (panelden değişmez);
 * yalnızca başlık ve açıklama metni `home.difference` bloğundan gelir. Sıra
 * blueprint'teki `pillars` dizisiyle birebir eşleşir.
 */
const PILLAR_PRESENTATION: readonly { icon: LucideIcon; accentColor: IconFeatureAccent }[] = [
  { icon: BookOpenCheck, accentColor: "aqua" },
  { icon: HeartHandshake, accentColor: "peach" },
  { icon: TrendingUp, accentColor: "grass" },
];

/**
 * "Farkı Biliyoruz" bölümü — referans sitenin `module--difference`
 * karşılığı. Ortalanmış başlık ve tek paragraf, altında üç düz ikon-özellik
 * bloğu (bkz. `IconFeature`).
 */
export async function DifferenceModule() {
  const content = await fetchPageContentBlock("home.difference");

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
          <SplitTitle lead={content.leadText} accent={content.accentText} align="center" className="mx-auto" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-ink-soft">
            {content.body}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-14">
          {content.pillars.map((pillar, index) => {
            const presentation = PILLAR_PRESENTATION[index % PILLAR_PRESENTATION.length];
            return (
              <Reveal key={`${index}-${pillar.title}`} delaySeconds={index * 0.08}>
                <IconFeature
                  icon={presentation.icon}
                  title={pillar.title}
                  description={pillar.description}
                  accentColor={presentation.accentColor}
                  index={String(index + 1).padStart(2, "0")}
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
