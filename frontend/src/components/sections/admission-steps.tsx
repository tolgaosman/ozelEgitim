import { ClipboardList, FileCheck2, MessagesSquare, Rocket } from "lucide-react";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { Reveal } from "@/components/shared/reveal";

const admissionSteps: { icon: typeof ClipboardList; accentColor: IconFeatureAccent; title: string; description: string }[] = [
  {
    icon: ClipboardList,
    accentColor: "aqua",
    title: "Ön Görüşme Formunu Doldurun",
    description:
      "Bu sayfadaki formu doldurarak çocuğunuz hakkında temel bilgileri bizimle paylaşın. Ekibimiz bir hafta içinde sizinle iletişime geçer.",
  },
  {
    icon: FileCheck2,
    accentColor: "peach",
    title: "RAM Raporunuzu İletin",
    description:
      "Güncel RAM raporunuz varsa süreç hızlanır. Raporunuz yoksa RAM başvurusu için size adım adım rehberlik ediyoruz.",
  },
  {
    icon: MessagesSquare,
    accentColor: "grass",
    title: "Değerlendirme Görüşmesi",
    description:
      "Uzman ekibimiz çocuğunuzla tanışır, güçlü yönlerini ve ihtiyaçlarını birlikte belirleriz.",
  },
  {
    icon: Rocket,
    accentColor: "aqua",
    title: "Bireyselleştirilmiş Programla Başlayın",
    description:
      "Çocuğunuza özel hazırlanan eğitim programı onaylanır ve seans takvimi birlikte planlanır.",
  },
];

export function AdmissionSteps() {
  return (
    <ol className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-14">
      {admissionSteps.map((step, index) => (
        <Reveal key={step.title} delaySeconds={index * 0.06}>
          <li>
            <IconFeature
              icon={step.icon}
              title={step.title}
              description={step.description}
              accentColor={step.accentColor}
              index={String(index + 1).padStart(2, "0")}
            />
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
