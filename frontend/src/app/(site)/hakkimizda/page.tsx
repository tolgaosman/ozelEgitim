import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sparkles, Target, type LucideIcon } from "lucide-react";
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
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";

/** İkon tasarımın sabit bir parçasıdır; sıra panelin `about.values` listesiyle birebir eşleşir. */
const VALUE_ICONS: readonly LucideIcon[] = [HeartHandshake, ShieldCheck, Target, Sparkles];
const ACCENT_COLORS: readonly IconFeatureAccent[] = ["aqua", "peach", "grass"];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.about");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/hakkimizda" } };
}

export default async function AboutPage() {
  const [hero, story, values, { stats }] = await Promise.all([
    fetchPageContentBlock("about.hero"),
    fetchPageContentBlock("about.story"),
    fetchPageContentBlock("about.values"),
    fetchSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        lead={hero.lead}
        accent={hero.accent}
        description={hero.description}
        breadcrumbItems={[{ label: "Hakkımızda" }]}
        image={hero.image}
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
              <SplitTitle lead={story.leadText} accent={story.accentText} />
              <div className="prose-copy mt-6 max-w-lg space-y-5 text-base leading-relaxed text-ink-soft">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delaySeconds={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={story.image}
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
              <Reveal
                key={`${index}-${stat.label}`}
                delaySeconds={index * 0.06}
                className="text-center sm:border-l sm:border-border sm:first:border-l-0 sm:[&:not(:first-child)]:pl-6"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-display-md font-extrabold text-navy-800">
                  <CountUp targetValue={stat.targetValue} suffix={stat.suffix} />
                </dd>
                <p className="mt-2 text-sm font-medium text-ink-soft">{stat.label}</p>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <SectionHeading eyebrow={values.eyebrow} title={values.title} align="center" />
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((value, index) => (
              <Reveal key={`${index}-${value.title}`} delaySeconds={index * 0.06}>
                <IconFeature
                  icon={VALUE_ICONS[index % VALUE_ICONS.length]}
                  title={value.title}
                  description={value.description}
                  accentColor={ACCENT_COLORS[index % ACCENT_COLORS.length]}
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
