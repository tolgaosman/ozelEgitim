"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  targetValue: number;
  suffix?: string;
  durationSeconds?: number;
  className?: string;
};

/**
 * İstatistik rakamları için tek seferlik, yavaş sayaç animasyonu.
 * Hareket azaltma tercihinde animasyonsuz doğrudan son değeri gösterir.
 *
 * Başlangıç değeri her koşulda `0`'dır (SSR-güvenli) — `useReducedMotion()`
 * sonucuna göre farklı bir ilk değerle başlatmak, sunucunun gerçek tercihi
 * bilmemesi yüzünden metin hidrasyon uyuşmazlığına yol açardı. Azaltılmış
 * hareket tespit edildiğinde son değere anında (mount sonrası, dolayısıyla
 * hidrasyonu etkilemeden) atlanır.
 */
export function CountUp({ targetValue, suffix = "", durationSeconds = 1.4, className }: CountUpProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Azaltılmış harekette süre sıfırlanır — setState'i effect gövdesinde
    // senkron çağırmak yerine (SSR/lint güvenli), animate() tek karede
    // hedef değere "atlar"; onUpdate her zaman aynı asenkron yoldan geçer.
    const controls = animate(0, targetValue, {
      duration: prefersReducedMotion ? 0 : durationSeconds,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latestValue) => setDisplayValue(Math.round(latestValue)),
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, targetValue, durationSeconds]);

  return (
    <span ref={containerRef} className={className} aria-label={`${targetValue}${suffix}`}>
      {displayValue}
      {suffix}
    </span>
  );
}
