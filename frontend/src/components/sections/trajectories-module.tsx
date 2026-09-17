import { Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CountUp } from "@/components/shared/count-up";
import type { SiteStat } from "@/lib/schemas/site-settings";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/schemas/testimonial";

const STAT_CIRCLE_CLASSES = ["bg-aqua-500/15", "bg-peach-400/15", "bg-grass-500/15", "bg-white/10"] as const;

// Sayaçlar yönetim panelinden gelir (site_stats tablosu) ve sunucu
// bileşeninden prop olarak geçirilir — kodda ikinci bir kopyası tutulmaz.

/**
 * "Hayat Değiştiren Yolculuklar" bölümü — referans sitenin
 * `module--trajectories` karşılığı. Tam genişlik koyu lacivert bant;
 * istatistik şeridi ve veli görüşleri burada birleşiyor (Faz 2'deki ayrı
 * `OutcomeStats` + `ParentTestimonials` bölümlerinin yerini alır).
 */
export function TrajectoriesModule({
  testimonials,
  outcomeStats,
}: {
  testimonials: Testimonial[];
  outcomeStats: SiteStat[];
}) {
  const [featuredTestimonial, ...remainingTestimonials] = testimonials;

  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 sm:py-20 lg:py-32" data-on-dark>
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.55} className="-top-14 right-[10%]" />
        <Shape color="navy" form="circle" scale={0.45} className="top-[18%] -left-12" />
        <Shape color="grass" form="circle" scale={0.35} className="-bottom-10 left-[20%]" />
      </ShapeField>

      <Container className="relative">
        <SplitTitle lead="Hayat Değiştiren" accent="Yolculuklar" onDark align="center" className="mx-auto" />

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

        {featuredTestimonial ? (
          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <Reveal delaySeconds={0.08}>
              <Quote className="size-10 text-aqua-500" aria-hidden="true" />
              <blockquote className="mt-4 font-display text-display-md font-semibold text-white text-balance">
                “{featuredTestimonial.quote}”
              </blockquote>
              <p className="mt-5 text-sm font-medium text-white">
                {featuredTestimonial.parentName}
                <span className="text-white/70"> — {featuredTestimonial.relationLabel}</span>
              </p>
            </Reveal>

            {remainingTestimonials.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {remainingTestimonials.map((testimonial, index) => (
                  <Reveal key={testimonial.id} delaySeconds={0.08 + index * 0.08}>
                    <div className="border-l-2 border-aqua-500/40 pl-5">
                      <blockquote className="text-sm leading-relaxed text-white/85">
                        “{testimonial.quote}”
                      </blockquote>
                      <p className="mt-3 text-sm font-medium text-white">
                        {testimonial.parentName}
                        <span className="text-white/60"> — {testimonial.relationLabel}</span>
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
