import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContactDetail = {
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href?: string;
};

type ContactDetailsListProps = {
  items: ContactDetail[];
  /** "dark" — eskiden koyu scrim üzerinde kullanılırdı, şu an pasif. */
  tone?: "light" | "dark";
  className?: string;
};

export function ContactDetailsList({ items, tone = "light", className }: ContactDetailsListProps) {
  const isDark = tone === "dark";

  return (
    <ul className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {items.map((detail) => {
        const Wrapper = detail.href ? "a" : "div";
        
        return (
          <li key={detail.label}>
            <Wrapper
              {...(detail.href ? { href: detail.href, target: detail.href.startsWith("http") ? "_blank" : undefined, rel: detail.href.startsWith("http") ? "noopener noreferrer" : undefined } : {})}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200",
                isDark 
                  ? "border-white/10 bg-white/5 hover:bg-white/10" 
                  : "border-border bg-white shadow-sm hover:border-aqua-500 hover:bg-aqua-50/30 hover:shadow-md",
                !detail.href && "cursor-default hover:border-border hover:bg-white hover:shadow-sm" // href yoksa buton efektlerini iptal et
              )}
            >
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isDark ? "bg-white/15 text-white" : "bg-paper text-navy-800 group-hover:bg-aqua-100 group-hover:text-navy-900",
                )}
              >
                <detail.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-white/70" : "text-ink-soft")}>
                  {detail.label}
                </p>
                <p className={cn("mt-0.5 truncate text-[15px] font-medium transition-colors", isDark ? "text-white" : "text-navy-900", detail.href && !isDark && "group-hover:text-aqua-600")}>
                  {detail.value}
                </p>
              </div>
              {detail.href && (
                <span className={cn("flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:translate-x-1", isDark ? "text-white/50 group-hover:text-white" : "text-ink-faint group-hover:text-aqua-500")}>
                  <ArrowRight className="size-5" aria-hidden="true" />
                </span>
              )}
            </Wrapper>
          </li>
        );
      })}
    </ul>
  );
}
