import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Başlıkta vurgulanan sözcüğün altına elle çizilmiş hissi veren şeftali çizgi. */
export function MarkerUnderline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-1 h-[0.3em] w-full text-peach-400"
      >
        <path d="M2 14 C 50 4, 150 4, 198 12" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </span>
  );
}
