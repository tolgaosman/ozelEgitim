import Image from "next/image";
import Link from "next/link";
import { Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { adminGet } from "@/lib/admin/client";
import { deleteProgramAction, reorderProgramsAction, restoreProgramAction } from "@/lib/admin/actions/programs";
import { swapAdjacentIds } from "@/lib/admin/reorder";
import type { AdminProgram } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";

export const metadata = { title: "Programlar" };

export default async function AdminProgramsPage() {
  const { data: programs } = await adminGet<{ data: AdminProgram[] }>("/api/admin/programs");
  const activePrograms = programs.filter((program) => !program.deletedAt);
  const trashedPrograms = programs.filter((program) => program.deletedAt);
  const orderedIds = activePrograms.map((program) => program.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Programlar</h1>
          <p className="mt-1 text-sm text-ink-soft">Sitede gösterilen destek eğitim programları.</p>
        </div>
        <Button render={<Link href="/admin/programlar/yeni" />}>
          <Plus className="size-4" />
          Yeni Program
        </Button>
      </div>

      {activePrograms.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Henüz program eklenmemiş.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {activePrograms.map((program, index) => (
            <li key={program.id} className="flex flex-wrap items-center gap-3 p-4">
              <ReorderButtons
                moveUpAction={reorderProgramsAction.bind(null, swapAdjacentIds(orderedIds, index, "up"))}
                moveDownAction={reorderProgramsAction.bind(null, swapAdjacentIds(orderedIds, index, "down"))}
                disableUp={index === 0}
                disableDown={index === activePrograms.length - 1}
              />
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                {program.imageUrl ? <Image src={program.imageUrl} alt="" fill sizes="56px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{program.name}</p>
                <p className="truncate text-sm text-ink-soft">{program.ageRangeLabel}</p>
              </div>
              <Badge variant={program.isPublished ? "default" : "secondary"} className={program.isPublished ? "bg-grass-500/15 text-grass-600" : ""}>
                {program.isPublished ? "Yayında" : "Taslak"}
              </Badge>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" render={<Link href={`/admin/programlar/${program.id}`} />}>
                  Düzenle
                </Button>
                <DeleteButton itemLabel={program.name} action={deleteProgramAction.bind(null, program.id, program.slug)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {trashedPrograms.length > 0 ? (
        <div>
          <h2 className="font-display text-base font-bold text-ink">Çöp Kutusu</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
            {trashedPrograms.map((program) => (
              <li key={program.id} className="flex flex-wrap items-center gap-3 p-4 opacity-70">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{program.name}</p>
                  <p className="truncate text-xs text-ink-faint">Silindi: {formatDateLabel(program.deletedAt!)}</p>
                </div>
                <form action={restoreProgramAction.bind(null, program.id, program.slug)}>
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
