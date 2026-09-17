import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

/*
 * Yerleşim sınıfları `sm:` önekli — mobilde ızgara iki eşit kolona düşer.
 * Öneksiz hâlde dört kolonluk düzensiz yerleşim telefonda ~67px genişliğinde
 * kullanılamaz dilimler üretiyor ve breakpoint ile ezilemiyordu.
 */
const collageImages = [
  { src: "/images/campus-1.jpg", position: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/campus-2.jpg", position: "sm:col-span-2 sm:col-start-3 sm:row-start-1" },
  { src: "/images/campus-3.jpg", position: "sm:col-start-3 sm:row-start-2" },
  { src: "/images/campus-4.jpg", position: "sm:col-start-4 sm:row-start-2" },
];

/** Kampüsten dört fotoğrafın düzensiz ızgarası — `/yasam` sayfasına teaser. */
export function CampusCollage() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Merkezimizde Yaşam"
            title="Çocuğunuzu her ziyaretinde tanıdık bir ortam karşılar"
          />
          <Link href="/merkezimiz" className="hover-bar text-sm font-bold text-navy-800">
            Merkezimizi keşfedin →
          </Link>
        </div>

        <Reveal delaySeconds={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:h-[28rem] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
            {collageImages.map((image) => (
              <div key={image.src} className={`relative aspect-square overflow-hidden rounded-xl sm:aspect-auto ${image.position}`}>
                <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 40vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
