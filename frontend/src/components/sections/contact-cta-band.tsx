import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/seo/constants";

/**
 * Kapanış CTA'sı — düz lacivert bant üzerinde sitenin başlık kalıbı ve iki
 * yüksek kontrastlı çağrı. Tüm sayfalarda kullanıldığı için buradaki
 * değişiklik site genelinde tutarlı bir kapanış oluşturur.
 */
export function ContactCtaBand() {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 text-center sm:py-20 lg:py-32" data-on-dark>
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.75} className="-top-20 -left-16" />
        <Shape color="grass" form="square" scale={0.45} className="right-[6%] -bottom-14" />
      </ShapeField>

      <Container className="relative">
        <SplitTitle
          lead="Doğru Adımı"
          accent="Şimdi Atın"
          onDark
          align="center"
          className="mx-auto"
        />
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
          Çocuğunuz için ücretsiz ön görüşme talebinde bulunun; ekibimiz bir hafta içinde
          sizinle iletişime geçsin.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="pill"
            render={<Link href="/iletisim" />}
            className="w-full bg-aqua-500 text-navy-900 hover:bg-white sm:w-auto"
          >
            Ön Görüşme Talep Edin
          </Button>
          {/* Hap geometrisi elle kopyalanmak yerine varyanttan gelir. */}
          <Button
            size="pill"
            variant="onDark"
            render={<a href={`tel:${SITE_PHONE_TEL}`} />}
            className="w-full border-2 border-white/50 sm:w-auto"
          >
            <PhoneCall className="size-5" aria-hidden="true" />
            {SITE_PHONE_DISPLAY}
          </Button>
        </div>
      </Container>
    </section>
  );
}
