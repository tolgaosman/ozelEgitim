import Link from "next/link";
import { CalendarCheck, ChevronDown, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { HeroSlider } from "@/components/shared/hero-slider";
import { SplitTitle } from "@/components/shared/split-title";

const heroSlides = [
  { src: "/images/hero-home.jpg" },
  { src: "/images/campus-1.jpg" },
  { src: "/images/approach.jpg" },
  { src: "/images/testimonial-feature.jpg" },
];

/**
 * Ana sayfanın karşılama bölümü — tam ekran çapraz geçişli fotoğraf slaytı
 * üzerinde sitenin başlık kalıbı. Sol altta duyuru kısayolu, sağ altta
 * kaydırma ipucu; üçü de referans sitenin hero yerleşimini izler.
 */
export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[max(35rem,calc(100svh-5rem))] w-full flex-col sm:min-h-[max(35rem,calc(100svh-6rem))]"
      data-scrim
    >
      <div className="absolute inset-0 bg-navy-hero overflow-hidden -z-20">
        <HeroSlider slides={heroSlides} />
        <div className="scrim-bottom absolute inset-0" aria-hidden="true" />
      </div>

      <Container className="relative flex flex-1 flex-col justify-end pb-14 sm:pb-16">
        <div className="flex items-end justify-between gap-6">
          <Link
            href="/duyurular"
            className="hidden items-center gap-2.5 rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            <Megaphone className="size-4.5" aria-hidden="true" />
            Duyurular
          </Link>

          <div className="mx-auto max-w-3xl text-center">
            <SplitTitle lead="Her çocuğun" accent="Kendine Özgü" onDark align="center" as="h1" />
            <p className="mt-3 text-lg font-medium text-white/90">bir izi vardır.</p>
            <p className="mt-1 text-sm font-bold tracking-wide text-aqua-500">#İzFarkı</p>

            <div className="mt-8 flex justify-center">
              <Button
                size="pill"
                render={<Link href="/iletisim" />}
                className="w-full bg-aqua-500 text-navy-900 hover:bg-white sm:w-auto"
              >
                <CalendarCheck className="size-5" aria-hidden="true" />
                Ücretsiz Ön Görüşme Talep Edin
              </Button>
            </div>
          </div>

          <a
            href="#bireye-ozel"
            className="hidden flex-col items-center gap-2 text-white sm:flex"
          >
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-white">
              <ChevronDown className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold tracking-wide uppercase">Kaydır</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
