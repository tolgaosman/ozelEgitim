import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const collageImages = [
  { src: "/images/campus-1.jpg", position: "col-span-2 row-span-2" },
  { src: "/images/campus-2.jpg", position: "col-span-2 col-start-3 row-start-1" },
  { src: "/images/campus-3.jpg", position: "col-start-3 row-start-2" },
  { src: "/images/campus-4.jpg", position: "col-start-4 row-start-2" },
];

/** Kampüsten dört fotoğrafın düzensiz ızgarası — `/yasam` sayfasına teaser. */
export function CampusCollage() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Merkezimizde Yaşam"
            title="Çocuğunuzu her ziyaretinde tanıdık bir ortam karşılar"
          />
          <Link href="/yasam" className="text-sm font-semibold text-clay-600 hover:underline">
            Merkezimizi keşfedin →
          </Link>
        </div>

        <Reveal delaySeconds={0.1}>
          <div className="mt-12 grid h-[28rem] grid-cols-4 grid-rows-2 gap-4">
            {collageImages.map((image) => (
              <div key={image.src} className={`relative overflow-hidden rounded-2xl ${image.position}`}>
                <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
