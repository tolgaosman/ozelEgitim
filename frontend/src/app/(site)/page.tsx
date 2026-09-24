import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/hero-section";
import { IndividualModule } from "@/components/sections/individual-module";
import { DifferenceModule } from "@/components/sections/difference-module";
import { ProgramShowcase } from "@/components/sections/program-showcase";
import { TrajectoriesModule } from "@/components/sections/trajectories-module";
import { AnnouncementStrip } from "@/components/sections/announcement-strip";
import { CampusCollage } from "@/components/sections/campus-collage";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchAnnouncementCollection } from "@/lib/repositories/announcements";

import { fetchSiteSettings } from "@/lib/repositories/site-settings";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [programs, announcements, siteSettings, programsSection] = await Promise.all([
    fetchProgramCollection(),
    fetchAnnouncementCollection(),
    fetchSiteSettings(),
    fetchPageContentBlock("home.programs_section"),
  ]);

  return (
    <>
      <HeroSection />
      <IndividualModule />
      <DifferenceModule />

      <section className="relative py-16 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-white -z-20" />
        <Container className="relative z-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow={programsSection.eyebrow}
              title={programsSection.title}
              description={programsSection.description}
            />
            <Link href="/programlar" className="hover-bar text-sm font-bold text-navy-800">
              {programsSection.linkLabel}
            </Link>
          </div>
          <div className="mt-12">
            <ProgramShowcase programs={programs} limit={6} />
          </div>
        </Container>
      </section>

      <TrajectoriesModule outcomeStats={siteSettings.stats} />
      <CampusCollage />
      <AnnouncementStrip announcements={announcements} />
      <ContactCtaBand />
    </>
  );
}
