import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/seo/constants";

/** Kapanış CTA'sı — tam genişlik fotoğraf ve koyu scrim üzerinde yüksek kontrastlı çağrı. */
export function ContactCtaBand() {
  return (
    <section className="relative overflow-hidden bg-ink" data-scrim>
      <Image src="/images/cta-band.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="scrim-full absolute inset-0" aria-hidden="true" />
      <Container className="relative py-24 text-center lg:py-32">
        <h2 className="mx-auto max-w-2xl font-display text-display-lg text-balance text-white">
          Çocuğunuz için doğru adımı atmaya hazır mısınız?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Ücretsiz ön görüşme talebinde bulunun; ekibimiz bir hafta içinde sizinle iletişime geçsin.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-12 px-6 text-base" render={<Link href="/kayit" />}>
            Ön Görüşme Talep Edin
          </Button>
          <a
            href={`tel:${SITE_PHONE_TEL}`}
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/40 px-6 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            <PhoneCall className="size-5" aria-hidden="true" />
            {SITE_PHONE_DISPLAY}
          </a>
        </div>
      </Container>
    </section>
  );
}
