import type { Metadata } from "next";
import Image from "next/image";
import { Armchair, Trees, Users2, Waves } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";

const accentColors: IconFeatureAccent[] = ["aqua", "peach", "grass"];

export const metadata: Metadata = {
  title: "Merkezimiz",
  description:
    "İz Özel Eğitim Merkezi'nde çocuğunuzu bekleyen sakin, güvenli ve destekleyici ortamı keşfedin.",
};

const facilities = [
  {
    icon: Waves,
    title: "Duyu Bütünleme Salonu",
    description: "Salıncak, denge tahtası ve dokunsal materyallerle donatılmış geniş bir terapi alanı.",
  },
  {
    icon: Armchair,
    title: "Bireysel Çalışma Odaları",
    description: "Dikkat dağıtıcı unsurlardan arındırılmış, sakin ışıklandırmalı bire bir eğitim odaları.",
  },
  {
    icon: Users2,
    title: "Sosyal Beceri Atölyesi",
    description: "Küçük grup çalışmaları için tasarlanmış, oyun temelli etkileşim alanı.",
  },
  {
    icon: Trees,
    title: "Duyusal Bahçe",
    description: "Açık hava molaları için güvenli, çitlerle çevrili yeşil alan.",
  },
];

const dailyFlow = [
  { time: "09:00", description: "Sakin karşılama ve günün akış kartlarıyla tanışma" },
  { time: "09:30", description: "Bireysel eğitim seansları (dil, akademik veya duyu bütünleme)" },
  { time: "11:00", description: "Kısa mola ve duyusal bahçede serbest oyun" },
  { time: "11:30", description: "Sosyal beceri atölyesi veya grup etkinliği" },
  { time: "12:30", description: "Aile ile gün sonu bilgilendirmesi" },
];

const galleryImages = ["/images/campus-1.jpg", "/images/campus-2.jpg", "/images/campus-3.jpg", "/images/campus-4.jpg"];

export default function CampusLifePage() {
  return (
    <>
      <PageHero
        lead=""
        accent="MERKEZİMİZ"
        description="Çocuğunuzu her ziyaretinde tanıdık, sakin ve güven veren bir ortam karşılar."
        breadcrumbItems={[{ label: "Merkezimiz" }]}
        image="/images/hero-life.jpg"
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {galleryImages.map((src, index) => (
              <div
                key={src}
                className={`relative aspect-[3/4] overflow-hidden rounded-xl ${index % 2 === 1 ? "sm:mt-10" : ""}`}
              >
                <Image src={src} alt="" fill sizes="(min-width: 640px) 25vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Mekanlarımız" title="Her alan, bir amaca hizmet eder" />
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility, index) => (
              <Reveal key={facility.title} delaySeconds={index * 0.06}>
                <IconFeature
                  icon={facility.icon}
                  title={facility.title}
                  description={facility.description}
                  accentColor={accentColors[index % accentColors.length]}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Öngörülebilirlik" title="Örnek bir gün akışı" align="center" />
          <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-10 sm:grid-cols-2">
            {dailyFlow.map((item, index) => (
              <Reveal key={item.time} delaySeconds={index * 0.05}>
                <li className="flex items-center gap-4 border-b border-border py-5 last:border-none sm:gap-6">
                  <span
                    aria-hidden="true"
                    className="flex w-16 shrink-0 items-center justify-center bg-navy-800 py-2 font-display text-lg font-extrabold text-white"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-navy-800">{item.time}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
