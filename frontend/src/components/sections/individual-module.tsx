import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";

/**
 * "Bireye Özel Program" bölümü — referans sitenin `module--individual`
 * karşılığı. Sol tarafta anlatı ve eylem çağrısı, sağda medya kartı;
 * bölüm kenarından taşan düz renk şekiller (`ShapeField`) tasarımın
 * imzasını taşır. Metin ve görsel panelden (`home.individual` bloğu) gelir.
 */
export async function IndividualModule() {
  const content = await fetchPageContentBlock("home.individual");

  return (
    <section id="bireye-ozel" className="relative py-16 sm:py-20 lg:py-32">
      <div className="absolute inset-0 bg-white -z-20" />

      <ShapeField className="-z-10">
        <Shape color="peach" form="square" scale={0.55} className="-top-10 left-[6%]" />
        <Shape color="aqua" form="circle" scale={0.7} className="-top-16 right-[4%]" />
        <Shape color="grass" form="square" scale={0.5} className="top-[45%] -right-16" />
        <Shape color="aqua" form="circle" scale={0.45} className="-bottom-14 left-[10%]" />
        <Shape color="peach" form="circle" scale={0.6} className="right-[8%] -bottom-20" />

        {/* Eklenen yeni şekiller */}
        <Shape color="peach" form="circle" scale={0.3} className="top-[30%] left-[25%] opacity-40" />
        <Shape color="grass" form="circle" scale={0.4} className="bottom-[20%] left-[45%] opacity-30" />
      </ShapeField>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SplitTitle lead={content.leadText} accent={content.accentText} />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">{content.body}</p>
            <div className="mt-8">
              <Button size="pill" render={<Link href="/programlar" />}>
                {content.ctaLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal delaySeconds={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={content.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
