import Image from "next/image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";

type PageHeroProps = {
  /** Öncü satır — örn. "Merkezimizde", SplitTitle'ın üst kelimesi olur. */
  lead: string;
  /** Büyük harf aksan satırı — örn. "YAŞAM". */
  accent: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  image: string;
};

/**
 * İç sayfaların standart üst bölümü — tam genişlik fotoğraf üzerinde koyu
 * lacivert karartma, kenardan taşan dekoratif şekiller ve sitenin başlık
 * kalıbı (`SplitTitle`). Fotoğraf her zaman dekoratiftir (`alt=""`); sayfa
 * başlığı aynı bilgiyi zaten metinsel olarak taşır.
 */
export function PageHero({ lead, accent, description, breadcrumbItems, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-800" data-scrim data-on-dark>
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="scrim-full absolute inset-0" aria-hidden="true" />
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.65} className="-top-16 right-[8%]" />
        <Shape color="peach" form="square" scale={0.5} className="-bottom-10 left-[4%]" />
      </ShapeField>
      <Container className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <Breadcrumbs items={breadcrumbItems} tone="dark" />
        <SplitTitle lead={lead} accent={accent} onDark className="mt-6" />
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
