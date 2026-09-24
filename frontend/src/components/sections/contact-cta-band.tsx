import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { SplitTitle } from "@/components/shared/split-title";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";

/**
 * Kapanış CTA'sı — düz lacivert bant üzerinde sitenin başlık kalıbı ve iki
 * yüksek kontrastlı çağrı. Tüm sayfalarda kullanıldığı için buradaki
 * değişiklik site genelinde tutarlı bir kapanış oluşturur. Metin panelden
 * (`cta_band` bloğu), telefon numarası site ayarlarından gelir.
 */
export async function ContactCtaBand() {
  const [content, { contact }] = await Promise.all([
    fetchPageContentBlock("cta_band"),
    fetchSiteSettings(),
  ]);

  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 text-center sm:py-20 lg:py-32" data-on-dark>
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.75} className="-top-20 -left-16" />
        <Shape color="grass" form="square" scale={0.45} className="right-[6%] -bottom-14" />
      </ShapeField>

      <Container className="relative">
        <SplitTitle
          lead={content.leadText}
          accent={content.accentText}
          onDark
          align="center"
          className="mx-auto"
        />
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{content.body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="pill"
            render={<Link href="/iletisim" />}
            className="w-full bg-aqua-500 text-navy-900 hover:bg-white sm:w-auto"
          >
            {content.ctaLabel}
          </Button>
          {/* Hap geometrisi elle kopyalanmak yerine varyanttan gelir. */}
          <Button
            size="pill"
            variant="onDark"
            render={<a href={`tel:${contact.phoneTel}`} />}
            className="w-full border-2 border-white/50 sm:w-auto"
          >
            <PhoneCall className="size-5" aria-hidden="true" />
            {contact.phoneDisplay}
          </Button>
        </div>
      </Container>
    </section>
  );
}
