import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "İz Özel Eğitim Merkezi'nin kuruluş hikayesi, misyonu ve eğitim felsefesi hakkında bilgi alın.",
};

const values = [
  {
    icon: HeartHandshake,
    title: "Şefkat ve Saygı",
    description: "Her çocuğa ve aileye, bireyselliğine saygı duyarak, yargılamadan yaklaşırız.",
  },
  {
    icon: ShieldCheck,
    title: "Bilimsel Güvenilirlik",
    description: "Uygulamalarımız güncel özel eğitim ve klinik psikoloji literatürüne dayanır.",
  },
  {
    icon: Target,
    title: "Hedef Odaklılık",
    description: "Her program, ölçülebilir ve çocuğun yaşam kalitesini artıran hedefler üzerine kurulur.",
  },
  {
    icon: Sparkles,
    title: "Sürekli Gelişim",
    description: "Ekibimiz düzenli hizmet içi eğitimlerle güncel yöntemleri takip eder.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Hakkımızda"
        description="18 yıldır özel gereksinimli çocuklara ve ailelerine bilime dayalı, şefkatli bir eğitim ortamı sunuyoruz."
        breadcrumbItems={[{ label: "Hakkımızda" }]}
        image="/images/hero-about.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container width="prose">
          <Reveal>
            <div className="prose-copy space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                İz Özel Eğitim Merkezi, 2008 yılında küçük bir odada, tek bir dil ve konuşma
                terapisti ile yola çıktı. Bugün; özel öğrenme güçlüğünden otizm spektrum
                bozukluğuna, dil-konuşma güçlüklerinden fizyoterapi ihtiyaçlarına kadar geniş bir
                yelpazede, alanında uzman bir ekiple hizmet veriyoruz.
              </p>
              <p>
                Misyonumuz, her çocuğun kendine özgü potansiyelini keşfetmesine ve mümkün olan en
                yüksek bağımsızlık düzeyine ulaşmasına destek olmaktır. Bunu yaparken aileleri
                sürecin dışında değil, tam merkezinde tutarız.
              </p>
            </div>
          </Reveal>

          <div className="mt-16">
            <SectionHeading eyebrow="Değerlerimiz" title="Bizi biz yapan ilkeler" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.title} delaySeconds={index * 0.06}>
                  <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-700">
                      <value.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">{value.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{value.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
