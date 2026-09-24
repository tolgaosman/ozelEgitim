import Image from "next/image";
import Link from "next/link";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { adminGet } from "@/lib/admin/client";
import { deleteStaffMemberAction, reorderStaffMembersAction, restoreStaffMemberAction } from "@/lib/admin/actions/staff";
import { swapAdjacentIds } from "@/lib/admin/reorder";
import type { AdminStaffMember } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";

export const metadata = { title: "Kadromuz" };

export default async function AdminStaffPage() {
  const { data: staffMembers } = await adminGet<{ data: AdminStaffMember[] }>("/api/admin/staff-members");
  const activeMembers = staffMembers.filter((member) => !member.deletedAt);
  const trashedMembers = staffMembers.filter((member) => member.deletedAt);
  const orderedIds = activeMembers.map((member) => member.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Kadromuz</h1>
          <p className="mt-1 text-sm text-ink-soft">Sitede tanıtılan ekip üyeleri.</p>
        </div>
        <Button render={<Link href="/admin/kadro/yeni" />}>
          <Plus className="size-4" />
          Yeni Kadro Üyesi
        </Button>
      </div>

      {activeMembers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Henüz kadro üyesi eklenmemiş.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {activeMembers.map((member, index) => (
            <li key={member.id} className="flex flex-wrap items-center gap-3 p-4">
              <ReorderButtons
                moveUpAction={reorderStaffMembersAction.bind(null, swapAdjacentIds(orderedIds, index, "up"))}
                moveDownAction={reorderStaffMembersAction.bind(null, swapAdjacentIds(orderedIds, index, "down"))}
                disableUp={index === 0}
                disableDown={index === activeMembers.length - 1}
              />
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-paper shadow-sm">
                {member.photoUrl ? <Image src={member.photoUrl} alt="" fill sizes="48px" className="object-cover" unoptimized /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{member.fullName}</p>
                <p className="truncate text-sm text-ink-soft">{member.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" render={<Link href={`/admin/kadro/${member.id}`} />}>
                  Düzenle
                </Button>
                <DeleteButton itemLabel={member.fullName} action={deleteStaffMemberAction.bind(null, member.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {trashedMembers.length > 0 ? (
        <div>
          <h2 className="font-display text-base font-bold text-ink">Çöp Kutusu</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
            {trashedMembers.map((member) => (
              <li key={member.id} className="flex flex-wrap items-center gap-3 p-4 opacity-70">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{member.fullName}</p>
                  <p className="truncate text-xs text-ink-faint">Silindi: {formatDateLabel(member.deletedAt!)}</p>
                </div>
                <form action={restoreStaffMemberAction.bind(null, member.id)}>
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
