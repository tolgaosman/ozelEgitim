import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type SplitTitleProps = {
  /** Normal ağırlıklı üst satır, örn. "Hayat Değiştiren". */
  lead: string;
  /** Büyük harf, kalın alt satır, örn. "YOLCULUKLAR". */
  accent: string;
  as?: ElementType;
  align?: "left" | "center";
  /** Koyu (lacivert) zemin üzerinde kullanım — metin beyaza döner. */
  onDark?: boolean;
  className?: string;
};

/**
 * Sitenin başlık kalıbı: normal bir öncü kelime grubu, altında devasa büyük
 * harf bir aksan kelimesi. Referans sitenin "The Gateway DIFFERENCE" /
 * "Life Changing TRAJECTORIES" deseni.
 *
 * DİKKAT: `accent` alanına marka adı ("İz") asla verilmez — kurumun yazım
 * kuralı büyük harfe çevrilen bir marka adını yasaklar (bkz. README).
 * Bu bileşen yalnız sayfa/bölüm başlıkları için kullanılmalıdır.
 */
export function SplitTitle({
  lead,
  accent,
  as: Component = "h2",
  align = "left",
  onDark = false,
  className,
}: SplitTitleProps) {
  return (
    <Component
      className={cn(
        "font-display",
        align === "center" && "text-center",
        onDark ? "text-white" : "text-ink",
        className,
      )}
    >
      <span className="block pb-1 text-strap leading-[1] font-semibold text-balance sm:pb-2">{lead}</span>
      {/*
       * `text-display-xl` bilinçli olarak `cn()` DIŞINDA tutulur: `cn`in
       * tailwind-merge tabloları yalnız Tailwind'in yerleşik ölçeğini bilir,
       * projenin `@theme` ile tanımladığı özel `--text-*` token'larını metin
       * RENGİ sanır. Aynı `cn()` çağrısında bir renk sınıfı da bulununca
       * çakışma sayıp boyutu düşürüyor ve aksan satırı gövde boyutunda
       * (17px) kalıyordu. Diğer tüm `text-display-*` kullanımları zaten düz
       * `className` içinde olduğu için bu sorundan etkilenmiyor.
       */}
      <span
        className={`text-display-xl ${cn(
          "block leading-[0.95] font-extrabold tracking-[-0.02em] break-words uppercase text-balance",
          onDark ? "text-aqua-500" : "text-navy-800",
        )}`}
      >
        {accent}
      </span>
    </Component>
  );
}
