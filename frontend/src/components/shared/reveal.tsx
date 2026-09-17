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

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Aynı satırdaki kartların art arda belirmesi için (saniye). */
  delaySeconds?: number;
};

/**
 * Görünüm alanına bir kez giren içerik için ölçülü giriş animasyonu.
 *
 * Yapı her zaman aynıdır (`<motion.div>`) — hareket tercihine göre
 * `<div>`/`<motion.div>` arasında dallanmak, sunucunun tercihi bilmemesi
 * yüzünden hidrasyon uyuşmazlığına ve azaltılmış hareket isteyen
 * kullanıcılarda içeriğin görünmez kalmasına yol açardı. `prefers-reduced-
 * motion` kararı kök `<MotionConfig reducedMotion="user">` tarafından
 * SSR-güvenli şekilde uygulanır (bkz. `motion-provider.tsx`).
 */
export function Reveal({ children, className, delaySeconds = 0 }: RevealProps) {
  return (
    <motion.div
      className={cn("motion-reduce-instant", className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...REVEAL_SPRING, delay: delaySeconds }}
    >
      {children}
    </motion.div>
  );
}
