import type { Metadata } from "next";
import Image from "next/image";
import { Armchair, Trees, Users2, Waves, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { IconFeature, type IconFeatureAccent } from "@/components/shared/icon-feature";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

const FACILITY_ICONS: readonly LucideIcon[] = [Waves, Armchair, Users2, Trees];
const ACCENT_COLORS: readonly IconFeatureAccent[] = ["aqua", "peach", "grass"];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.campus");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/merkezimiz" } };
}

export default async function CampusLifePage() {
  const [hero, gallery, facilities, schedule] = await Promise.all([
    fetchPageContentBlock("campus.hero"),
    fetchPageContentBlock("campus.gallery"),
    fetchPageContentBlock("campus.facilities"),
    fetchPageContentBlock("campus.schedule"),
  ]);

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Merkezimiz" }]}
        image={hero.image}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {gallery.images.map((src, index) => (
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
          <SectionHeading eyebrow={facilities.eyebrow} title={facilities.title} />
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.items.map((facility, index) => (
              <Reveal key={`${index}-${facility.title}`} delaySeconds={index * 0.06}>
                <IconFeature
                  icon={FACILITY_ICONS[index % FACILITY_ICONS.length]}
                  title={facility.title}
                  description={facility.description}
                  accentColor={ACCENT_COLORS[index % ACCENT_COLORS.length]}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow={schedule.eyebrow} title={schedule.title} align="center" />
          <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-10 sm:grid-cols-2">
            {schedule.items.map((item, index) => (
              <Reveal
                key={`${item.time}-${index}`}
                as="li"
                delaySeconds={index * 0.05}
                className="flex items-center gap-4 border-b border-border py-5 last:border-none sm:gap-6"
              >
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
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
