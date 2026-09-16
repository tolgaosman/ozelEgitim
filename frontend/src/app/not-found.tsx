import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-sage-50 text-sage-700">
        <Compass className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-display-md text-ink">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Bağlantı eski olabilir veya sayfa taşınmış olabilir. Ana sayfadan devam edebilir ya da
        bizimle iletişime geçebilirsiniz.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button render={<Link href="/" />}>Ana Sayfaya Dön</Button>
        <Button variant="outline" render={<Link href="/iletisim" />}>
          Bizimle İletişime Geçin
        </Button>
      </div>
    </section>
  );
}
