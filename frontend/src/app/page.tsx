import Link from "next/link";
import { HeroSection } from "@/components/sections/hero-section";
import { IntroStatement } from "@/components/sections/intro-statement";
import { ApproachPillars } from "@/components/sections/approach-pillars";
import { ProgramShowcase } from "@/components/sections/program-showcase";
import { OutcomeStats } from "@/components/sections/outcome-stats";
import { AnnouncementStrip } from "@/components/sections/announcement-strip";
import { ParentTestimonials } from "@/components/sections/parent-testimonials";
import { CampusCollage } from "@/components/sections/campus-collage";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchAnnouncementCollection } from "@/lib/repositories/announcements";
import { fetchTestimonialCollection } from "@/lib/repositories/testimonials";

export default async function HomePage() {
  const [programs, announcements, testimonials] = await Promise.all([
    fetchProgramCollection(),
    fetchAnnouncementCollection(),
    fetchTestimonialCollection(),
  ]);

  return (
    <>
      <HeroSection />
      <IntroStatement />
      <ApproachPillars />

      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Programlarımız"
              title="İhtiyaca özel destek eğitim programları"
              description="Her program, RAM raporu ve klinik değerlendirme doğrultusunda bireyselleştirilir."
            />
            <Link href="/programlar" className="text-sm font-semibold text-clay-600 hover:underline">
              Tüm programları görüntüle →
            </Link>
          </div>
          <div className="mt-12">
            <ProgramShowcase programs={programs} limit={6} />
          </div>
        </Container>
      </section>

      <OutcomeStats />
      <ParentTestimonials testimonials={testimonials} />
      <CampusCollage />
      <AnnouncementStrip announcements={announcements} />
      <ContactCtaBand />
    </>
  );
}
