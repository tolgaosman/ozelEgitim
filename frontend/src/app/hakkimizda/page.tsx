import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { SectionHeading } from "@/components/shared/section-heading";
import { SplitTitle } from "@/components/shared/split-title";
import { CountUp } from "@/components/shared/count-up";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { CampusCollage } from "@/components/sections/campus-collage";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";

const accentColors: IconFeatureAccent[] = ["aqua", "peach", "grass"];



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

export default async function AboutPage() {
  const { stats } = await fetchSiteSettings();

  return (
    <>
      <PageHero
        lead="Bizi Yakından"
        accent="TANIYIN"
        description="18 yıldır özel gereksinimli çocuklara ve ailelerine bilime dayalı, şefkatli bir eğitim ortamı sunuyoruz."
        breadcrumbItems={[{ label: "Hakkımızda" }]}
        image="/images/hero-about.jpg"
      />

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-32">
        <div className="absolute inset-0 -z-20 bg-white" />
        <ShapeField className="-z-10">
          <Shape color="aqua" form="circle" scale={0.5} className="-top-12 right-[6%]" />
          <Shape color="peach" form="square" scale={0.4} className="top-[55%] -left-14" />
        </ShapeField>

        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SplitTitle lead="Küçük bir odadan" accent="Bugüne" />
              <div className="prose-copy mt-6 max-w-lg space-y-5 text-base leading-relaxed text-ink-soft">
                <p>
                  İz Özel Eğitim Merkezi, 2008 yılında küçük bir odada, tek bir dil ve konuşma
                  terapisti ile yola çıktı. Bugün; özel öğrenme güçlüğünden otizm spektrum
                  bozukluğuna, dil-konuşma güçlüklerinden fizyoterapi ihtiyaçlarına kadar geniş
                  bir yelpazede, alanında uzman bir ekiple hizmet veriyoruz.
                </p>
                <p>
                  Misyonumuz, her çocuğun kendine özgü potansiyelini keşfetmesine ve mümkün olan
                  en yüksek bağımsızlık düzeyine ulaşmasına destek olmaktır. Bunu yaparken
                  aileleri sürecin dışında değil, tam merkezinde tutarız.
                </p>
              </div>
            </Reveal>

            <Reveal delaySeconds={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-staff.jpg"
                  alt="İz Özel Eğitim Merkezi ekibi"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delaySeconds={index * 0.06}>
                <div className="text-center sm:border-l sm:border-border sm:first:border-l-0 sm:[&:not(:first-child)]:pl-6">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-display-md font-extrabold text-navy-800">
                    <CountUp targetValue={stat.targetValue} suffix={stat.suffix} />
                  </dd>
                  <p className="mt-2 text-sm font-medium text-ink-soft">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Değerlerimiz" title="Bizi biz yapan ilkeler" align="center" />
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delaySeconds={index * 0.06}>
                <IconFeature
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  accentColor={accentColors[index % accentColors.length]}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CampusCollage />

      <ContactCtaBand />
    </>
  );
}
