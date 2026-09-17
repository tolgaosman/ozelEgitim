import type { Metadata } from "next";
import { Suspense, type SVGProps } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ContactDetailsList, type ContactDetail } from "@/components/shared/contact-details-list";
import { SectionHeading } from "@/components/shared/section-heading";
import { AdmissionSteps } from "@/components/sections/admission-steps";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";
import type { SiteSettings } from "@/lib/schemas/site-settings";

export const metadata: Metadata = {
  title: "İletişim ve Başvuru",
  description: "İz Özel Eğitim Merkezi ile iletişime geçin, adres ve çalışma saatlerimizi öğrenin, kayıt başvuru formunu doldurun.",
};

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9h3V5.5h-3C11.24 5.5 9.5 7.32 9.5 10v2H7v3.5h2.5V22h3.5v-6.5H16l.5-3.5h-3v-1.7c0-.86.4-1.3 1.5-1.3Z" />
    </svg>
  );
}

/**
 * İletişim bilgileri yönetim panelinden gelir; boş bırakılan bir sosyal medya
 * bağlantısı listeye hiç eklenmez.
 */
function buildContactDetails(siteSettings: SiteSettings): ContactDetail[] {
  const { contact, socialLinks } = siteSettings;

  const details: ContactDetail[] = [
    { icon: MapPin, label: "Adres", value: contact.address, href: contact.mapsUrl },
    { icon: Phone, label: "Telefon", value: contact.phoneDisplay, href: `tel:${contact.phoneTel}` },
    { icon: Mail, label: "E-posta", value: contact.email, href: `mailto:${contact.email}` },
  ];

  if (socialLinks.instagram) {
    details.push({ icon: InstagramGlyph, label: "Instagram", value: "@iz_ozel_rehabilitasyon", href: socialLinks.instagram });
  }

  if (socialLinks.facebook) {
    details.push({ icon: FacebookGlyph, label: "Facebook", value: "İz Özel Eğitim", href: socialLinks.facebook });
  }

  return details;
}

export default async function ContactPage() {
  const [siteSettings, programs] = await Promise.all([
    fetchSiteSettings(),
    fetchProgramCollection(),
  ]);

  const contactDetails = buildContactDetails(siteSettings);
  const programOptions = programs.map((program) => ({
    value: program.slug,
    label: program.name,
  }));

  return (
    <>
      <PageHero
        lead="İletişim ve"
        accent="BAŞVURU"
        description="Süreç, göründüğünden daha kolay. Size dört adımda rehberlik ediyoruz."
        breadcrumbItems={[{ label: "Kayıt ve Başvuru" }]}
        image="/images/hero-admissions.jpg"
      />

      <section className="bg-paper py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Sol Kolon: İletişim Bilgileri (Resim yok, sade liste) */}
            <div className="flex flex-col lg:col-span-2">
              <div>
                <SectionHeading
                  title="İlk adımı birlikte atalım"
                  description="Bize aşağıdaki kanallardan doğrudan ulaşabilirsiniz."
                />
                <ContactDetailsList
                  items={contactDetails}
                  className="mt-8"
                />
              </div>

              {/* Çalışma Saatleri (Kompakt) */}
              <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-navy-900">Çalışma Saatleri</h3>
                <ul className="space-y-3 text-[15px]">
                  <li className="flex items-center justify-between">
                    <span className="font-semibold text-ink-soft">Hafta İçi</span>
                    <span className="font-medium text-navy-900">{siteSettings.openingHours.weekday}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-semibold text-ink-soft">Cumartesi</span>
                    <span className="font-medium text-navy-900">{siteSettings.openingHours.saturday}</span>
                  </li>
                  <li className="flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="font-semibold text-ink-soft">Pazar</span>
                    <span className="font-medium text-rose-600">{siteSettings.openingHours.sunday}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sağ Kolon: Form */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-raised)] sm:p-8 lg:col-span-3 lg:p-12">
              <SectionHeading
                eyebrow="Ön Görüşme"
                title="Bize ulaşın"
                description="Formu doldurun; ekibimiz kısa süre içinde sizi arayarak uygun bir görüşme zamanı planlasın."
              />
              <div className="mt-8 lg:mt-12">
                <Suspense fallback={<div className="h-[500px] animate-pulse rounded-xl bg-ink-faint/10" />}>
                  <InquiryForm programOptions={programOptions} />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Süreç" title="Kayıt nasıl ilerler?" />
          <div className="mt-10 lg:mt-12">
            <AdmissionSteps />
          </div>
        </Container>
      </section>
    </>
  );
}
