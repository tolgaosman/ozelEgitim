import Link from "next/link";
import { CheckCircle2, CircleDashed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { adminGet } from "@/lib/admin/client";
import { deleteTestimonialAction, reorderTestimonialsAction } from "@/lib/admin/actions/testimonials";
import { swapAdjacentIds } from "@/lib/admin/reorder";
import type { AdminTestimonial } from "@/lib/admin/types";

export const metadata = { title: "Veli Yorumları" };

export default async function AdminTestimonialsPage() {
  const { data: testimonials } = await adminGet<{ data: AdminTestimonial[] }>("/api/admin/testimonials");
  const orderedIds = testimonials.map((testimonial) => testimonial.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Veli Yorumları</h1>
          <p className="mt-1 text-sm text-ink-soft">Sitede gösterilen veli görüşleri.</p>
        </div>
        <Button render={<Link href="/admin/veli-yorumlari/yeni" />}>
          <Plus className="size-4" />
          Yeni Yorum
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Henüz veli yorumu eklenmemiş.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {testimonials.map((testimonial, index) => (
            <li key={testimonial.id} className="flex flex-wrap items-center gap-3 p-4">
              <ReorderButtons
                moveUpAction={reorderTestimonialsAction.bind(null, swapAdjacentIds(orderedIds, index, "up"))}
                moveDownAction={reorderTestimonialsAction.bind(null, swapAdjacentIds(orderedIds, index, "down"))}
                disableUp={index === 0}
                disableDown={index === testimonials.length - 1}
              />
              {testimonial.isPublished ? (
                <CheckCircle2 className="size-4 shrink-0 text-grass-600" aria-label="Yayında" />
              ) : (
                <CircleDashed className="size-4 shrink-0 text-ink-faint" aria-label="Yayında değil" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{testimonial.parentName}</p>
                <p className="truncate text-xs text-ink-soft">{testimonial.relationLabel}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" render={<Link href={`/admin/veli-yorumlari/${testimonial.id}`} />}>
                  Düzenle
                </Button>
                <DeleteButton
                  itemLabel={testimonial.parentName}
                  variant="permanent"
                  action={deleteTestimonialAction.bind(null, testimonial.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
