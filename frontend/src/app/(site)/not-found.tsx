import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export default function NotFoundPage() {
  return (
    <>
      {/* Sabit konumlu, koyu zemin üzerinde şeffaf gezinme çubuğunun bu açık
          renkli sayfada okunaksız kalmaması için lacivert bir üst şerit —
          diğer iç sayfalardaki `PageHero`nun sağladığı kontrastın karşılığı. */}
      <div className="h-28 bg-navy-900 sm:h-32" aria-hidden="true" />
      <Container width="prose" as="section" className="flex max-w-xl flex-col items-center py-16 text-center sm:py-24">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-aqua-100 text-navy-800">
          <Compass className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-display-md font-bold text-ink">Aradığınız sayfa bulunamadı</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Bağlantı eski olabilir veya sayfa taşınmış olabilir. Ana sayfadan devam edebilir ya da
          bizimle iletişime geçebilirsiniz.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button render={<Link href="/" />}>Ana Sayfaya Dön</Button>
          <Button variant="outline" render={<Link href="/iletisim" />}>
            Bizimle İletişime Geçin
          </Button>
        </div>
      </Container>
    </>
  );
}
