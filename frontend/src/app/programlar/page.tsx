import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ProgramShowcase } from "@/components/sections/program-showcase";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { fetchProgramCollection } from "@/lib/repositories/programs";

export const metadata: Metadata = {
  title: "Programlarımız",
  description:
    "Özel öğrenme güçlüğü, dil ve konuşma terapisi, otizm spektrum destek programı ve daha fazlası — İz Özel Eğitim Merkezi'nin destek eğitim programlarını inceleyin.",
};

export default async function ProgramsPage() {
  const programs = await fetchProgramCollection();

  return (
    <>
      <PageHero
        lead="Destek Eğitim"
        accent="PROGRAMLARIMIZ"
        description="Her program, RAM raporu ve klinik değerlendirme doğrultusunda çocuğunuza özel olarak planlanır."
        breadcrumbItems={[{ label: "Programlarımız" }]}
        image="/images/hero-programs.jpg"
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <ProgramShowcase programs={programs} />
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
