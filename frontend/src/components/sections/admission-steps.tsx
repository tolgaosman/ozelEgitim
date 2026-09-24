import { ClipboardList, FileCheck2, MessagesSquare, Rocket, type LucideIcon } from "lucide-react";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { Reveal } from "@/components/shared/reveal";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

/** İkon ve vurgu rengi tasarımın sabit bir parçasıdır; metin panelden (`contact.admission_steps`) gelir. */
const STEP_PRESENTATION: readonly { icon: LucideIcon; accentColor: IconFeatureAccent }[] = [
  { icon: ClipboardList, accentColor: "aqua" },
  { icon: FileCheck2, accentColor: "peach" },
  { icon: MessagesSquare, accentColor: "grass" },
  { icon: Rocket, accentColor: "aqua" },
];

export async function AdmissionSteps() {
  const content = await fetchPageContentBlock("contact.admission_steps");

  return (
    <ol className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-14">
      {content.steps.map((step, index) => {
        const presentation = STEP_PRESENTATION[index % STEP_PRESENTATION.length];
        return (
          <Reveal key={`${index}-${step.title}`} as="li" delaySeconds={index * 0.06}>
            <IconFeature
              icon={presentation.icon}
              title={step.title}
              description={step.description}
              accentColor={presentation.accentColor}
              index={String(index + 1).padStart(2, "0")}
            />
          </Reveal>
        );
      })}
    </ol>
  );
}
