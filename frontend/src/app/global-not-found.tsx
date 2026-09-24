import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Figtree } from "next/font/google";
import { Compass } from "lucide-react";
import "@/app/globals.css";

/**
 * `experimental.globalNotFound` (bkz. `next.config.ts`) ile eşleşmeyen HER
 * yol için devreye girer — sitenin (`(site)`) ve panelin (`admin`) ayrı kök
 * layout'ları olduğu için tek bir `not-found.tsx` ikisini birden kapsayamaz.
 * Tüm layout'ları atladığı için kendi `<html>/<body>`sini, fontunu ve global
 * stillerini kendisi taşır; `Reveal`/`MotionProvider` gibi bağlam gerektiren
 * bileşenler burada KULLANILMAZ.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı — İz Özel Eğitim Merkezi",
  description: "Aradığınız sayfa bulunamadı.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={figtree.variable}>
      <body className="flex min-h-svh flex-col bg-paper font-sans text-ink antialiased">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
          <Image
            src="/assets/logo-mark.png"
            alt="İz Özel Eğitim Merkezi"
            width={56}
            height={56}
            className="size-14"
          />
          <span className="mt-8 flex size-16 items-center justify-center rounded-2xl bg-aqua-100 text-navy-800">
            <Compass className="size-8" aria-hidden="true" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">Aradığınız sayfa bulunamadı</h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
            Bağlantı eski olabilir veya sayfa taşınmış olabilir. Ana sayfadan devam edebilirsiniz.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-navy-800 px-6 text-sm font-bold text-white transition-colors hover:bg-navy-900"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </body>
    </html>
  );
}
