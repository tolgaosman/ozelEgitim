import Link from "next/link";
import { CheckCircle2, CircleDashed, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { adminGet } from "@/lib/admin/client";
import { deleteFaqAction, reorderFaqsAction, restoreFaqAction } from "@/lib/admin/actions/faqs";
import { swapAdjacentIds } from "@/lib/admin/reorder";
import { formatFaqCategoryLabel } from "@/lib/format";
import type { AdminFaq } from "@/lib/admin/types";

export const metadata = { title: "Sıkça Sorulan Sorular" };

export default async function AdminFaqsPage() {
  const { data: faqs } = await adminGet<{ data: AdminFaq[] }>("/api/admin/faqs");
  const activeFaqs = faqs.filter((faq) => !faq.deletedAt);
  const trashedFaqs = faqs.filter((faq) => faq.deletedAt);
  const orderedIds = activeFaqs.map((faq) => faq.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Sıkça Sorulan Sorular</h1>
          <p className="mt-1 text-sm text-ink-soft">SSS sayfasındaki sorular ve cevaplar.</p>
        </div>
        <Button render={<Link href="/admin/sss/yeni" />}>
          <Plus className="size-4" />
          Yeni Soru
        </Button>
      </div>

      {activeFaqs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Henüz soru eklenmemiş.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {activeFaqs.map((faq, index) => (
            <li key={faq.id} className="flex flex-wrap items-center gap-3 p-4">
              <ReorderButtons
                moveUpAction={reorderFaqsAction.bind(null, swapAdjacentIds(orderedIds, index, "up"))}
                moveDownAction={reorderFaqsAction.bind(null, swapAdjacentIds(orderedIds, index, "down"))}
                disableUp={index === 0}
                disableDown={index === activeFaqs.length - 1}
              />
              {faq.isPublished ? (
                <CheckCircle2 className="size-4 shrink-0 text-grass-600" aria-label="Yayında" />
              ) : (
                <CircleDashed className="size-4 shrink-0 text-ink-faint" aria-label="Gizli" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{faq.question}</p>
                <p className="text-xs font-bold tracking-wide text-navy-600 uppercase">{formatFaqCategoryLabel(faq.category)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" render={<Link href={`/admin/sss/${faq.id}`} />}>
                  Düzenle
                </Button>
                <DeleteButton itemLabel={faq.question} action={deleteFaqAction.bind(null, faq.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {trashedFaqs.length > 0 ? (
        <div>
          <h2 className="font-display text-base font-bold text-ink">Çöp Kutusu</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
            {trashedFaqs.map((faq) => (
              <li key={faq.id} className="flex flex-wrap items-center gap-3 p-4 opacity-70">
                <p className="min-w-0 flex-1 truncate font-bold text-ink">{faq.question}</p>
                <form action={restoreFaqAction.bind(null, faq.id)}>
                  <Button type="submit" variant="outline" size="sm">
                    <RotateCcw className="size-3.5" />
                    Geri Al
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
