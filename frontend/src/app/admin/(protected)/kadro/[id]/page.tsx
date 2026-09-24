import { StaffMemberForm } from "@/components/admin/staff/staff-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminStaffMember } from "@/lib/admin/types";

export const metadata = { title: "Kadro Üyesini Düzenle" };

export default async function EditStaffMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: staffMember } = await adminGet<{ data: AdminStaffMember }>(`/api/admin/staff-members/${id}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{staffMember.fullName}</h1>
        <p className="mt-1 text-sm text-ink-soft">Kadro üyesi bilgilerini düzenleyin.</p>
      </div>
      <StaffMemberForm staffMember={staffMember} />
    </div>
  );
}
