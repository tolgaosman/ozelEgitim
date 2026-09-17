"use client";

import { motion, type Transition } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Tasarımın imza öğesi: bölüm kenarlarından taşan, düz tek renk dev daire
 * ve kareler. Referans sitede bunlar sayfanın tek dekoratif dili — gradyan,
 * gölge, doku yok; yalnız katı renk ve geometri.
 *
 * Boyut tek bir akışkan değişkene bağlıdır (`--shape-size`, 165px > 320px),
 * böylece tüm bölümlerde aynı ölçek hissi korunur.
 */

const SHAPE_COLOR_CLASSES = {
  aqua: "bg-aqua-500",
  grass: "bg-grass-500",
  peach: "bg-peach-400",
  navy: "bg-navy-600",
  signal: "bg-signal",
  white: "bg-white",
} as const;

const SHAPE_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export type ShapeColor = keyof typeof SHAPE_COLOR_CLASSES;

type ShapeProps = {
  color?: ShapeColor;
  form?: "circle" | "square";
  /** `--shape-size` çarpanı; 0.5 yarım, 2 iki kat. */
  scale?: number;
  /**
   * Fotoğraf veya koyu bant üzerinde şeklin altındaki içeriği yutmaması
   * için renk karıştırma. Referans site bunu birkaç şekilde kullanıyor.
   */
  blend?: boolean;
  delaySeconds?: number;
  /** Konumlandırma (`absolute` zaten uygulanır): örn. `-top-10 right-[var(--gutter)]`. */
  className?: string;
};

export function Shape({
  color = "aqua",
  form = "circle",
  scale = 1,
  blend = false,
  delaySeconds = 0,
  className,
}: ShapeProps) {
  const size = scale === 1 ? "var(--shape-size)" : `calc(var(--shape-size) * ${scale})`;

  return (
    <motion.span
      className={cn(
        "absolute block motion-reduce-instant",
        SHAPE_COLOR_CLASSES[color],
        form === "circle" && "rounded-full",
        /*
         * Karıştırmalı şekiller tanım gereği metnin üstüne biner; tek kolona
         * düşen mobil yerleşimde başlığı okunamaz hale getiriyorlardı, bu
         * yüzden `sm` altında gizlenirler. Kenardan taşan karıştırmasız
         * şekiller metin akışının dışında kaldığı için mobilde de kalır.
         */
        blend && "hidden mix-blend-difference sm:block",
        className,
      )}
      style={{ width: size, height: size } satisfies CSSProperties}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...SHAPE_SPRING, delay: delaySeconds }}
    />
  );
}

/**
 * Şekillerin kabı — yalnızca konumlandırma bağlamı verir, kırpmaz. Şekiller
 * kasıtlı olarak bölüm kenarının yarısı dışarıda kalacak şekilde taşar;
 * asıl kırpma, yatay kaydırmayı önlemek için üst bölüme `overflow-hidden`
 * verilerek yapılır (bkz. kullanım noktaları). Tamamen dekoratiftir: ekran
 * okuyucudan gizlenir ve hiçbir tıklamayı yakalamaz.
 */
export function ShapeField({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {children}
    </div>
  );
}
