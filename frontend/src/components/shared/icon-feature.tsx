import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_CLASSES = {
  aqua: { bar: "bg-aqua-500", chip: "bg-aqua-100 text-navy-800", index: "text-aqua-600" },
  grass: { bar: "bg-grass-500", chip: "bg-grass-100 text-navy-800", index: "text-grass-600" },
  peach: { bar: "bg-peach-400", chip: "bg-peach-100 text-navy-800", index: "text-peach-500" },
} as const;

export type IconFeatureAccent = keyof typeof ACCENT_CLASSES;

type IconFeatureProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: IconFeatureAccent;
  /** İsteğe bağlı "01" gibi sıra numarası; verilmezse gösterilmez. */
  index?: string;
  className?: string;
};

/**
 * Sitenin kutu/gölge yerine kullandığı düz ikon-özellik bloğu: renkli aksan
 * çubuğu + ikon çipi (+ isteğe bağlı sıra no) üstte, başlık ve açıklama
 * altta. Değerler, tesisler, farklar gibi tüm ikon+metin ızgaralarının ortak
 * görsel dili — `border`/`shadow`/`bg-card` kullanılmaz.
 */
export function IconFeature({ icon: Icon, title, description, accentColor, index, className }: IconFeatureProps) {
  const accent = ACCENT_CLASSES[accentColor];

  return (
    <div className={cn("group flex h-full flex-col gap-5", className)}>
      <span className={cn("block h-1.5 w-14 rounded-full", accent.bar)} aria-hidden="true" />

      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-105",
            accent.chip,
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
        {index ? (
          <span className={cn("font-display text-3xl font-extrabold", accent.index)} aria-hidden="true">
            {index}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
    </div>
  );
}
