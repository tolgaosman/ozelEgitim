import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-peach-50 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-sage-50 text-sage-600">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-soft">{description}</p>
    </div>
  );
}
