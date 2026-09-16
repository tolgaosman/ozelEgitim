import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { AdmissionSteps } from "@/components/sections/admission-steps";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Kayıt ve Başvuru",
  description:
    "İz Özel Eğitim Merkezi'ne kayıt ve başvuru süreci: ön görüşme formu, RAM raporu ve değerlendirme adımları.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        title="Kayıt ve Başvuru"
        description="Süreç, göründüğünden daha kolay. Size dört adımda rehberlik ediyoruz."
        breadcrumbItems={[{ label: "Kayıt ve Başvuru" }]}
        image="/images/hero-admissions.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Süreç" title="Kayıt nasıl ilerler?" />
          <div className="mt-12">
            <AdmissionSteps />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[1.75rem] border border-border shadow-[var(--shadow-raised)] lg:grid-cols-5">
            <div className="relative hidden min-h-[32rem] lg:col-span-2 lg:block">
              <Image src="/images/hero-staff.jpg" alt="" fill sizes="40vw" className="object-cover" />
              <div className="scrim-full absolute inset-0" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="font-display text-display-sm text-white">
                  İlk adımı birlikte atalım
                </p>
                <div className="mt-4 space-y-1.5 text-sm text-white/85">
                  <p>
                    <a href={`tel:${SITE_PHONE_TEL}`} className="font-medium hover:underline">
                      {SITE_PHONE_DISPLAY}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${SITE_EMAIL}`} className="font-medium hover:underline">
                      {SITE_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 lg:col-span-3 lg:p-12">
              <SectionHeading
                eyebrow="Ön Görüşme"
                title="Bize ulaşın"
                description="Formu doldurun; ekibimiz bir hafta içinde sizi arayarak uygun bir görüşme zamanı planlasın."
              />
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
