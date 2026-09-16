import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** "dark" — fotoğraf üzeri koyu scrim üzerinde kullanım (PageHero). */
  tone?: "light" | "dark";
};

export function Breadcrumbs({ items, tone = "light" }: BreadcrumbsProps) {
  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className={cn("flex flex-wrap items-center gap-1.5", isDark ? "text-white/70" : "text-ink-soft")}>
        <li>
          <Link href="/" className={isDark ? "hover:text-white" : "hover:text-ink"}>
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              {item.href && !isLastItem ? (
                <Link href={item.href} className={isDark ? "hover:text-white" : "hover:text-ink"}>
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLastItem ? "page" : undefined}
                  className={isDark ? "text-white" : "text-ink"}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
