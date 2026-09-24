import type { Metadata } from "next";
import { Suspense, type SVGProps } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ContactDetailsList, type ContactDetail } from "@/components/shared/contact-details-list";
import { SectionHeading } from "@/components/shared/section-heading";
import { AdmissionSteps } from "@/components/sections/admission-steps";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";
import type { SiteSettings } from "@/lib/schemas/site-settings";
import type { PageContent } from "@/lib/schemas/page-content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.contact");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/iletisim" } };
}

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

function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}

/**
 * İletişim bilgileri yönetim panelinden gelir; boş bırakılan bir sosyal medya
 * bağlantısı listeye hiç eklenmez.
 */
function buildContactDetails(siteSettings: SiteSettings, intro: PageContent["contact.intro"]): ContactDetail[] {
  const { contact, socialLinks } = siteSettings;

  const details: ContactDetail[] = [
    { icon: MapPin, label: "Adres", value: contact.address, href: contact.mapsUrl },
    { icon: Phone, label: "Telefon", value: contact.phoneDisplay, href: `tel:${contact.phoneTel}` },
    { icon: Mail, label: "E-posta", value: contact.email, href: `mailto:${contact.email}` },
  ];

  if (socialLinks.instagram) {
    details.push({ icon: InstagramGlyph, label: "Instagram", value: intro.instagramLabel, href: socialLinks.instagram });
  }

  if (socialLinks.facebook) {
    details.push({ icon: FacebookGlyph, label: "Facebook", value: intro.facebookLabel, href: socialLinks.facebook });
  }

  if (socialLinks.youtube) {
    details.push({ icon: YoutubeGlyph, label: "YouTube", value: "YouTube", href: socialLinks.youtube });
  }

  return details;
}

export default async function ContactPage() {
  const [siteSettings, programs, hero, intro, formIntro] = await Promise.all([
    fetchSiteSettings(),
    fetchProgramCollection(),
    fetchPageContentBlock("contact.hero"),
    fetchPageContentBlock("contact.intro"),
    fetchPageContentBlock("contact.form_intro"),
  ]);

  const contactDetails = buildContactDetails(siteSettings, intro);
  const programOptions = programs.map((program) => ({
    value: program.slug,
    label: program.name,
  }));

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Kayıt ve Başvuru" }]}
        image={hero.image}
      />

      <section className="bg-paper py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Sol Kolon: İletişim Bilgileri (Resim yok, sade liste) */}
            <div className="flex flex-col lg:col-span-2">
              <div>
                <SectionHeading
                  title={intro.title}
                  description={intro.description}
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
                    <span className="font-medium text-signal">{siteSettings.openingHours.sunday}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sağ Kolon: Form */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-raised)] sm:p-8 lg:col-span-3 lg:p-12">
              <SectionHeading
                eyebrow={formIntro.eyebrow}
                title={formIntro.title}
                description={formIntro.description}
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

      <SectionAdmissionSteps />
    </>
  );
}

async function SectionAdmissionSteps() {
  const { eyebrow, title } = await fetchPageContentBlock("contact.admission_steps");

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-10 lg:mt-12">
          <AdmissionSteps />
        </div>
      </Container>
    </section>
  );
}
