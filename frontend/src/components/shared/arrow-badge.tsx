import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kart/bağlantı köşesinde dairesel ok rozeti. Ebeveyni `group` sınıfına
 * sahipse hover'da kayar; `prefers-reduced-motion` ve hareket tercihi
 * globals.css'teki `[data-motion="reduced"]` kuralıyla otomatik durdurulur.
 */
export function ArrowBadge({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-1",
        tone === "light" ? "border-ink/15 bg-white text-ink" : "border-white/25 bg-white/10 text-white",
        className,
      )}
    >
      <ArrowUpRight className="size-4.5" />
    </span>
  );
}
