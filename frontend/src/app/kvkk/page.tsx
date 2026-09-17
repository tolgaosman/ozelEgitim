import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

/**
 * Metin yönetim panelinden (Site Ayarları → KVKK aydınlatma metni) gelir.
 * Şu anki içerik YER TUTUCUDUR — yayına alınmadan önce merkezin hukuk
 * danışmanı tarafından 6698 sayılı KVKK'ya uygun şekilde hazırlanmalı,
 * onaylanmalı ve panelden güncellenmelidir.
 */
export default async function PrivacyPolicyPage() {
  const { kvkkBody } = await fetchSiteSettings();

  return (
    <>
      <section className="border-b border-border/70 bg-paper py-16">
        <Container width="prose">
          <Breadcrumbs items={[{ label: "KVKK Aydınlatma Metni" }]} />
          <h1 className="mt-4 font-display text-display-lg text-balance text-ink">KVKK Aydınlatma Metni</h1>
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
