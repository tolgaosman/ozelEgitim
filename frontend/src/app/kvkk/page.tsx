import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Prose } from "@/components/shared/prose";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

/**
 * YER TUTUCU METİN — bu sayfa gerçek bir hukuki belge değildir. Yayına
 * alınmadan önce merkezin hukuk danışmanı tarafından 6698 sayılı KVKK'ya
 * uygun şekilde hazırlanmalı ve onaylanmalıdır.
 */
const kvkkParagraphs = [
  "İz Özel Eğitim Merkezi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine önem veriyoruz.",
  "İletişim formu ve kayıt başvurusu aracılığıyla paylaştığınız ad-soyad, telefon, e-posta ve çocuğunuza ilişkin bilgiler; yalnızca ön görüşme sürecinin yürütülmesi ve eğitim hizmetlerinin planlanması amacıyla işlenir.",
  "Kişisel verileriniz, açık rızanız veya kanunlarda öngörülen diğer veri işleme şartları dışında üçüncü kişilerle paylaşılmaz.",
  "KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@izozelegitim.com adresinden bizimle iletişime geçebilirsiniz.",
  "Bu metin yer tutucu niteliktedir; nihai aydınlatma metni merkezimizin hukuk danışmanlığı tarafından hazırlanıp yayımlanacaktır.",
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-paper py-16">
        <Container width="prose">
          <Breadcrumbs items={[{ label: "KVKK Aydınlatma Metni" }]} />
          <h1 className="mt-4 font-display text-display-lg text-balance text-ink">KVKK Aydınlatma Metni</h1>
        </Container>
      </section>
      <section className="bg-white py-16 lg:py-24">
        <Container width="prose">
          <Prose paragraphs={kvkkParagraphs} />
        </Container>
      </section>
    </>
  );
}
