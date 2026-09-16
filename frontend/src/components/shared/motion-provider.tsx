"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Framer Motion'a `prefers-reduced-motion` tercihini merkezi olarak
 * uygular. Bileşen bazında `useReducedMotion()` sonucuna göre render
 * ağacını (ör. `<motion.div>` / düz `<div>`) dallandırmak, sunucu
 * (tercih bilinmez) ile istemci (gerçek tercih) arasında yapısal bir
 * hidrasyon uyuşmazlığına yol açar — tam da azaltılmış hareket isteyen
 * kullanıcılarda içeriğin görünmez kalmasına neden olan hataydı bu.
 * `MotionConfig` bu kararı framer-motion'ın kendi SSR-güvenli mekanizmasına
 * bırakır: yapı hep aynıdır, yalnızca animasyon süresi anlık olur.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
