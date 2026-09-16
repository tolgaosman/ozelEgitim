"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO(backend): merkezi hata izleme servisi bağlandığında burada raporlanmalı.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-display-md text-ink">Beklenmeyen bir hata oluştu</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Sayfayı yeniden yüklemeyi deneyebilirsiniz. Sorun devam ederse bizimle iletişime geçin.
      </p>
      <Button className="mt-8" onClick={reset}>
        Yeniden Dene
      </Button>
    </section>
  );
}
