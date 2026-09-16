import type { Metadata } from "next";
import Image from "next/image";
import { Armchair, Trees, Users2, Waves } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { OutlineNumeral } from "@/components/shared/outline-numeral";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";

export const metadata: Metadata = {
  title: "Merkezimizde Yaşam",
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
        title="Merkezimizde Yaşam"
        description="Çocuğunuzu her ziyaretinde tanıdık, sakin ve güven veren bir ortam karşılar."
        breadcrumbItems={[{ label: "Merkezimizde Yaşam" }]}
        image="/images/hero-life.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <div
                key={src}
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${index % 2 === 1 ? "mt-10" : ""}`}
              >
                <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <SectionHeading eyebrow="Mekanlarımız" title="Her alan, bir amaca hizmet eder" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility, index) => (
              <Reveal key={facility.title} delaySeconds={index * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-clay-50 text-clay-600">
                    <facility.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">{facility.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{facility.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Öngörülebilirlik" title="Örnek bir gün akışı" align="center" />
          <ol className="mt-12 space-y-2">
            {dailyFlow.map((item, index) => (
              <Reveal key={item.time} delaySeconds={index * 0.05}>
                <li className="flex items-center gap-6 border-b border-border py-5 last:border-none">
                  <OutlineNumeral
                    value={String(index + 1).padStart(2, "0")}
                    className="w-16 shrink-0 text-3xl text-sage-300"
                  />
                  <div>
                    <p className="font-display text-sm font-semibold text-clay-600">{item.time}</p>
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
