import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

/*
 * Yerleşim sınıfları `sm:` önekli — mobilde ızgara iki eşit kolona düşer.
 * Öneksiz hâlde dört kolonluk düzensiz yerleşim telefonda ~67px genişliğinde
 * kullanılamaz dilimler üretiyor ve breakpoint ile ezilemiyordu. Konum
 * yerleşimi tasarımın sabit bir parçasıdır; yalnızca görsel kaynakları
 * panelden (`home.campus.images`) gelir.
 */
const COLLAGE_POSITIONS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-2 sm:col-start-3 sm:row-start-1",
  "sm:col-start-3 sm:row-start-2",
  "sm:col-start-4 sm:row-start-2",
] as const;

/** Kampüsten dört fotoğrafın düzensiz ızgarası — `/merkezimiz` sayfasına teaser. */
export async function CampusCollage() {
  const content = await fetchPageContentBlock("home.campus");

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <Link href="/merkezimiz" className="hover-bar text-sm font-bold text-navy-800">
            {content.linkLabel}
          </Link>
        </div>

        <Reveal delaySeconds={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:h-[28rem] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
            {content.images.map((src, index) => (
              <div
                key={src}
                className={`relative aspect-square overflow-hidden rounded-xl sm:aspect-auto ${COLLAGE_POSITIONS[index % COLLAGE_POSITIONS.length]}`}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 40vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
