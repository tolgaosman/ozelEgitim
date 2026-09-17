"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type HeroSlide = {
  src: string;
  alt?: string;
};

const AUTOPLAY_INTERVAL_MS = 6500;

function readsReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const prefersOsReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersSiteReduced = document.documentElement.dataset.motion === "reduced";
  return prefersOsReduced || prefersSiteReduced;
}

/**
 * Tam ekran çapraz geçişli fotoğraf slaytı — sitenin hero'su. Otomatik
 * geçiş yalnızca hareket tercihi izin verdiğinde çalışır; her koşulda
 * klavye ve dokunmatik ile manuel geçiş kullanılabilir kalır.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  useEffect(() => {
    const syncAutoplayFromPreference = () => setAutoplayEnabled(!readsReducedMotion());
    syncAutoplayFromPreference();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const attributeObserver = new MutationObserver(syncAutoplayFromPreference);
    attributeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    motionQuery.addEventListener("change", syncAutoplayFromPreference);

    return () => {
      attributeObserver.disconnect();
      motionQuery.removeEventListener("change", syncAutoplayFromPreference);
    };
  }, []);

  const slideCount = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoplayEnabled || slideCount <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplayEnabled, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0 motion-reduce-instant"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slides[activeIndex].src}
            alt={slides[activeIndex].alt ?? ""}
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {slideCount > 1 ? (
        <div className="absolute top-1/2 right-[var(--gutter)] z-10 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}. görsele geç`}
              aria-current={index === activeIndex}
              className={cn(
                "size-3 rounded-full border-2 border-white transition-colors duration-300",
                index === activeIndex ? "bg-white" : "bg-transparent hover:bg-white/50",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
