import { Container } from "@/components/shared/container";
import { CountUp } from "@/components/shared/count-up";
import type { SiteStat } from "@/lib/schemas/site-settings";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { cn } from "@/lib/utils";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

const STAT_CIRCLE_CLASSES = ["bg-aqua-500/15", "bg-peach-400/15", "bg-grass-500/15", "bg-white/10"] as const;

// Sayaçlar yönetim panelinden gelir (site_stats tablosu) ve sunucu
// bileşeninden prop olarak geçirilir — kodda ikinci bir kopyası tutulmaz.

/**
 * "Hayat Değiştiren Yolculuklar" bölümü — referans sitenin
 * `module--trajectories` karşılığı. Tam genişlik koyu lacivert bant;
 * istatistik şeridini gösterir. Veli görüşleri bilinçli olarak kaldırıldı;
 * `fetchTestimonialCollection` ve `/admin/veli-yorumlari` paneli hâlâ
 * duruyor, ileride başka bir bölümde kullanılabilir.
 */
export async function TrajectoriesModule({
  outcomeStats,
}: {
  outcomeStats: SiteStat[];
}) {
  const content = await fetchPageContentBlock("home.trajectories");

  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 sm:py-20 lg:py-32" data-on-dark>
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.55} className="-top-14 right-[10%]" />
        <Shape color="navy" form="circle" scale={0.45} className="top-[18%] -left-12" />
        <Shape color="grass" form="circle" scale={0.35} className="-bottom-10 left-[20%]" />
      </ShapeField>

      <Container className="relative">
        <SplitTitle lead={content.leadText} accent={content.accentText} onDark align="center" className="mx-auto" />

        <dl className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-12 sm:gap-x-16">
          {outcomeStats.map((stat, index) => (
            <Reveal key={stat.label} delaySeconds={index * 0.08}>
              <div
                className={cn(
                  "flex flex-col items-center text-center",
                  index % 2 === 1 ? "sm:translate-y-7" : "sm:-translate-y-1",
                )}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className={`flex size-28 items-center justify-center rounded-full font-display text-display-md font-extrabold text-white sm:size-32 ${STAT_CIRCLE_CLASSES[index % STAT_CIRCLE_CLASSES.length]}`}
                >
                  <CountUp targetValue={stat.targetValue} suffix={stat.suffix} />
                </dd>
                <p className="mt-4 max-w-[9rem] text-sm font-medium text-white/75">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
