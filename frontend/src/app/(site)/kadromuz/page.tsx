import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { StaffDirectory } from "@/components/sections/staff-directory";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchStaffCollection } from "@/lib/repositories/staff";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.staff");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/kadromuz" } };
}

export default async function StaffPage() {
  const [hero, staffMembers] = await Promise.all([
    fetchPageContentBlock("staff.hero"),
    fetchStaffCollection(),
  ]);

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Kadromuz" }]}
        image={hero.image}
      />

      <section className="bg-paper py-16 sm:py-20 lg:py-32">
        <Container>
          <StaffDirectory staffMembers={staffMembers} />
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
