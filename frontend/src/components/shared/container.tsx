import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** "wide" masaüstünde editoryal genişlik (1600px); "prose" uzun metinler için okunabilir sütun. */
  width?: "wide" | "prose";
  as?: ElementType;
};

/**
 * Sitenin tek genişlik kaynağı. Faz 1'de her bölüm `max-w-7xl` (1280px) ile
 * boğulmuştu; masaüstünde geniş, editoryal bir his için konteyner 1600px'e
 * çıkarıldı. Mobil uyum bu turun kapsamı dışında tutulmuştur.
 */
export function Container({ children, className, width = "wide", as: Component = "div" }: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto px-6 sm:px-10 lg:px-16",
        width === "wide" ? "max-w-[100rem]" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </Component>
  );
}
