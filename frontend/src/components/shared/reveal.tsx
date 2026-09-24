"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const REVEAL_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.8,
};

const REVEAL_COMPONENTS = {
  div: motion.div,
  li: motion.li,
  dd: motion.dd,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Aynı satırdaki kartların art arda belirmesi için (saniye). */
  delaySeconds?: number;
  /**
   * Sarmalayıcı öğe — varsayılan `div`. `ul/ol > li` veya `dl > dt/dd` gibi
   * geçerli bir ebeveyn/çocuk ilişkisi gereken yerlerde `li`/`dd` kullanılır;
   * aksi halde araya giren bir `<div>` geçersiz HTML üretir ve o listenin
   * `:first-child`/`:last-child` seçicilerini kırar (bkz. kullanım noktaları).
   */
  as?: keyof typeof REVEAL_COMPONENTS;
};

/**
 * Görünüm alanına bir kez giren içerik için ölçülü giriş animasyonu.
 *
 * Yapı her zaman aynıdır (`<motion.div>`/`<motion.li>`/`<motion.dd>`) —
 * hareket tercihine göre `<div>`/`<motion.div>` arasında dallanmak,
 * sunucunun tercihi bilmemesi yüzünden hidrasyon uyuşmazlığına ve
 * azaltılmış hareket isteyen kullanıcılarda içeriğin görünmez kalmasına yol
 * açardı. `prefers-reduced-motion` kararı kök `<MotionConfig
 * reducedMotion="user">` tarafından SSR-güvenli şekilde uygulanır (bkz.
 * `motion-provider.tsx`).
 */
export function Reveal({ children, className, delaySeconds = 0, as = "div" }: RevealProps) {
  const MotionComponent = REVEAL_COMPONENTS[as];

  return (
    <MotionComponent
      className={cn("motion-reduce-instant", className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...REVEAL_SPRING, delay: delaySeconds }}
    >
      {children}
    </MotionComponent>
  );
}
