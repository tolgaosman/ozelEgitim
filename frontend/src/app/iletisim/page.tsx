import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { SITE_ADDRESS, SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "İletişim",
  description: "İz Özel Eğitim Merkezi ile iletişime geçin — adres, telefon, e-posta ve çalışma saatleri.",
};

const contactDetails = [
  { icon: MapPin, label: "Adres", value: SITE_ADDRESS },
  { icon: Phone, label: "Telefon", value: SITE_PHONE_DISPLAY, href: `tel:${SITE_PHONE_TEL}` },
  { icon: Mail, label: "E-posta", value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
  { icon: Clock, label: "Çalışma Saatleri", value: "Hafta içi 08:30 – 18:00" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="İletişim"
        description="Sorularınız için bize her zaman ulaşabilirsiniz."
        breadcrumbItems={[{ label: "İletişim" }]}
        image="/images/hero-contact.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[1.75rem] border border-border shadow-[var(--shadow-raised)] lg:grid-cols-5">
            <div className="relative hidden min-h-[36rem] lg:col-span-2 lg:block">
              <Image src="/images/approach.jpg" alt="" fill sizes="40vw" className="object-cover" />
              <div className="scrim-full absolute inset-0" aria-hidden="true" />
              <ul className="absolute inset-x-0 bottom-0 space-y-5 p-8">
                {contactDetails.map((detail) => (
                  <li key={detail.label} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                      <detail.icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-white/70">{detail.label}</p>
                      {detail.href ? (
                        <a href={detail.href} className="text-sm font-medium text-white hover:underline">
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-white">{detail.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 lg:col-span-3 lg:p-12">
              <InquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
