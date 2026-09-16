import { Container } from "@/components/shared/container";
import { CountUp } from "@/components/shared/count-up";
import { CurveDivider } from "@/components/shared/curve-divider";
import { GrainOverlay } from "@/components/shared/grain-overlay";

const outcomeStats = [
  { targetValue: 18, suffix: "+", label: "Yıllık Deneyim" },
  { targetValue: 620, suffix: "+", label: "Desteklenen Çocuk" },
  { targetValue: 8, suffix: "", label: "Uzmanlık Alanında Program" },
  { targetValue: 94, suffix: "%", label: "Ailelerin Memnuniyet Oranı" },
];

/** Tam genişlik koyu orman yeşili bant — editoryal ritmin ilk "kırılma anı". */
export function OutcomeStats() {
  return (
    <section className="relative overflow-hidden bg-forest-900">
      <CurveDivider fill="var(--paper)" className="absolute top-0 left-0" />
      <GrainOverlay />
      <Container className="relative py-24 lg:py-28">
        <dl className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {outcomeStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-display-lg text-white">
                <CountUp targetValue={stat.targetValue} suffix={stat.suffix} />
              </dd>
              <p className="mt-2 text-sm text-sage-200">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Container>
      <CurveDivider fill="var(--peach-100)" flip className="absolute bottom-0 left-0" />
    </section>
  );
}
