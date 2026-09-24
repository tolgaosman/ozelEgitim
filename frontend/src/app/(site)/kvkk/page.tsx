import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageContentBlock("seo.kvkk");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/kvkk" } };
}

/**
 * Metin yönetim panelinden (Site Ayarları → KVKK aydınlatma metni) gelir.
 * Şu anki içerik YER TUTUCUDUR — yayına alınmadan önce merkezin hukuk
 * danışmanı tarafından 6698 sayılı KVKK'ya uygun şekilde hazırlanmalı,
 * onaylanmalı ve panelden güncellenmelidir.
 */
export default async function PrivacyPolicyPage() {
  const [{ kvkkBody }, { title }] = await Promise.all([
    fetchSiteSettings(),
    fetchPageContentBlock("kvkk.page"),
  ]);

  return (
    <>
      {/* Sabit konumlu, koyu zemin üzerinde şeffaf gezinme çubuğunun bu açık
          renkli sayfada okunaksız kalmaması için lacivert bir üst şerit —
          diğer iç sayfalardaki `PageHero`nun sağladığı kontrastın karşılığı. */}
      <div className="h-28 bg-navy-900 sm:h-32" aria-hidden="true" />
      <section className="border-b border-border/70 bg-paper py-16">
        <Container width="prose">
          <Breadcrumbs items={[{ label: title }]} />
          <h1 className="mt-4 font-display text-display-lg text-balance text-ink">{title}</h1>
        </Container>
      </section>
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <Container width="prose">
          <Prose paragraphs={kvkkBody} />
        </Container>
      </section>
    </>
  );
}
