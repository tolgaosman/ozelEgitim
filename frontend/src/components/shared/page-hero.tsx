import Image from "next/image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  image: string;
};

/**
 * İç sayfaların standart üst bölümü — tam genişlik fotoğraf + koyu scrim
 * üzerinde breadcrumb ve editoryal başlık. Faz 1'deki düz `PageIntro`'nun
 * yerini alır. Fotoğraf her zaman dekoratiftir (`alt=""`); sayfa başlığı
 * aynı bilgiyi zaten metinsel olarak taşır.
 */
export function PageHero({ title, description, breadcrumbItems, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink" data-scrim>
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="scrim-full absolute inset-0" aria-hidden="true" />
      <Container className="relative py-24 lg:py-32">
        <Breadcrumbs items={breadcrumbItems} tone="dark" />
        <h1 className="mt-6 max-w-3xl text-display-lg font-display text-white">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
