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
 * oluşturur — kart içinde ikinci bir gerçek bağlantı bulunmaz. Köşeler
 * yumuşak (rounded-xl); yalnız tam pill CTA butonları tam yuvarlaktır.
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
        "group relative flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-spring)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] active:translate-y-0 active:scale-[0.99]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-100 text-navy-800"
        >
          <Icon className="size-5" />
        </span>
        {badgeLabel ? (
          <span className="rounded-full bg-peach-100 px-3 py-1 text-xs font-semibold text-navy-800">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-display text-lg font-bold text-ink">
          <Link href={href} className="stretched-link focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>

      {metaLabel ? (
        <p className="text-xs font-bold tracking-wide text-navy-600 uppercase">{metaLabel}</p>
      ) : null}

      {footer ? <div className="relative z-[2] pt-1">{footer}</div> : null}
    </Component>
  );
}
