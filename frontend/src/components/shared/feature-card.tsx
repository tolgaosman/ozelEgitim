import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Örn. "6-14 yaş" gibi kısa üst bilgi. */
  metaLabel?: string;
  /** Örn. "Duyuru" gibi kategori rozeti. */
  badgeLabel?: string;
  footer?: ReactNode;
  as?: ElementType;
  className?: string;
};

/**
 * Programlar, duyurular ve kadro kartlarının türetildiği tek gerçek kaynak
 * (Rule 04: 3+ tekrar eden desen → soyutlama). Kart tamamı `stretched-link`
 * deseniyle tıklanabilir, ancak ekran okuyucuda yalnızca tek bir odak durağı
 * oluşturur — kart içinde ikinci bir gerçek bağlantı bulunmaz.
 */
export function FeatureCard({
  href,
  title,
  description,
  icon: Icon,
  metaLabel,
  badgeLabel,
  footer,
  as: Component = "article",
  className,
}: FeatureCardProps) {
  return (
    <Component
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6",
        "shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-spring)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] active:translate-y-0 active:scale-[0.99]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-700"
        >
          <Icon className="size-5" />
        </span>
        {badgeLabel ? (
          <span className="rounded-full bg-clay-50 px-3 py-1 text-xs font-medium text-clay-700">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-display text-lg font-semibold text-ink">
          <Link href={href} className="stretched-link focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>

      {metaLabel ? (
        <p className="text-xs font-medium tracking-wide text-sage-700">{metaLabel}</p>
      ) : null}

      {footer ? <div className="relative z-[2] pt-1">{footer}</div> : null}
    </Component>
  );
}
