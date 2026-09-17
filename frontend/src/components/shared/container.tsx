import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** "wide" masaüstünde tam genişlik (1920px); "prose" uzun metinler için okunabilir sütun. */
  width?: "wide" | "prose";
  as?: ElementType;
};

/**
 * Sitenin tek genişlik kaynağı. Referans sitenin ölçüleriyle hizalandı:
 * içerik 1920px'e kadar açılır ve yatay boşluk tek bir akışkan değişkenden
 * (--gutter, 30px > 50px) gelir. Böylece dekoratif şekillerin bölüm
 * kenarlarından ne kadar taşacağı da aynı ölçüye bağlanabiliyor.
 */
export function Container({ children, className, width = "wide", as: Component = "div" }: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto px-[var(--gutter)]",
        width === "wide" ? "max-w-[120rem]" : "max-w-3xl lg:max-w-[120rem]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
