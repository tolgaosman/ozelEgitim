import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, HandHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { MarkerUnderline } from "@/components/shared/marker-underline";
import { Reveal } from "@/components/shared/reveal";

const quickFacts = [
  { value: "18+", label: "Yıllık deneyim" },
  { value: "620+", label: "Desteklenen çocuk" },
  { value: "8", label: "Uzmanlık programı" },
  { value: "%94", label: "Aile memnuniyeti" },
];

/**
 * Ana sayfanın karşılama bölümü — tam genişlik fotoğraf, alt-sol koyu
 * gradyan scrim üzerinde tek bir <h1>, iki yüksek kontrastlı CTA ve
 * kaydırma ipucu. Altta, bant sınırını taşan kısa bir güven şeridi.
 */
export function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-ink" data-scrim>
        <Image
          src="/images/hero-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="scrim-bottom absolute inset-0" aria-hidden="true" />

        <Container className="relative flex h-full flex-col justify-end pb-32 lg:pb-36">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-peach-200">
              <Sparkles className="size-4" aria-hidden="true" />
              18 yıldır çocukların ve ailelerin yanındayız
            </p>

            <h1 className="mt-5 max-w-4xl text-display-xl font-display text-white">
              Her çocuğun <MarkerUnderline className="font-display italic">kendine özgü</MarkerUnderline> bir izi vardır
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Uzman kadromuz ve bilime dayalı programlarımızla, çocuğunuzun güçlü
              yönlerini keşfetmesine ve bağımsızlık kazanmasına eşlik ediyoruz.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 px-6 text-base" render={<Link href="/kayit" />}>
                <CalendarCheck className="size-5" aria-hidden="true" />
                Ücretsiz Ön Görüşme Talep Edin
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/60 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/programlar" />}
              >
                <HandHeart className="size-5" aria-hidden="true" />
                Programlarımızı İnceleyin
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>

      <Container className="relative -mt-14 lg:-mt-16">
        <Reveal delaySeconds={0.1}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-[var(--shadow-raised)] sm:grid-cols-4">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="bg-white px-6 py-8 text-center">
                <p className="font-display text-display-sm text-ink">{fact.value}</p>
                <p className="mt-1 text-sm text-ink-soft">{fact.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
