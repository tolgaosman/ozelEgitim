import { ClipboardList, FileCheck2, MessagesSquare, Rocket } from "lucide-react";
import { OutlineNumeral } from "@/components/shared/outline-numeral";
import { Reveal } from "@/components/shared/reveal";

const admissionSteps = [
  {
    icon: ClipboardList,
    title: "Ön Görüşme Formunu Doldurun",
    description:
      "Bu sayfadaki formu doldurarak çocuğunuz hakkında temel bilgileri bizimle paylaşın. Ekibimiz bir hafta içinde sizinle iletişime geçer.",
  },
  {
    icon: FileCheck2,
    title: "RAM Raporunuzu İletin",
    description:
      "Güncel RAM raporunuz varsa süreç hızlanır. Raporunuz yoksa RAM başvurusu için size adım adım rehberlik ediyoruz.",
  },
  {
    icon: MessagesSquare,
    title: "Değerlendirme Görüşmesi",
    description:
      "Uzman ekibimiz çocuğunuzla tanışır, güçlü yönlerini ve ihtiyaçlarını birlikte belirleriz.",
  },
  {
    icon: Rocket,
    title: "Bireyselleştirilmiş Programla Başlayın",
    description:
      "Çocuğunuza özel hazırlanan eğitim programı onaylanır ve seans takvimi birlikte planlanır.",
  },
];

export function AdmissionSteps() {
  return (
    <ol className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
      {admissionSteps.map((step, index) => (
        <Reveal key={step.title} delaySeconds={index * 0.06}>
          <li className="flex h-full gap-2">
            <OutlineNumeral value={String(index + 1).padStart(2, "0")} className="text-4xl text-sage-300 sm:text-5xl" />
            <div className="pt-1">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <step.icon className="size-4.5 text-clay-600" aria-hidden="true" />
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">{step.description}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
