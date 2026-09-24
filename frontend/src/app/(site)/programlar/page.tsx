import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ProgramShowcase } from "@/components/sections/program-showcase";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchProgramCollection } from "@/lib/repositories/programs";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.programs");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/programlar" } };
}

export default async function ProgramsPage() {
  const [hero, programs] = await Promise.all([
    fetchPageContentBlock("programs.hero"),
    fetchProgramCollection(),
  ]);

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Programlarımız" }]}
        image={hero.image}
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
