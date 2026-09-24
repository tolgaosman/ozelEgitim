import { StaffMemberForm } from "@/components/admin/staff/staff-form";

export const metadata = { title: "Yeni Kadro Üyesi" };

export default function NewStaffMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Kadro Üyesi</h1>
        <p className="mt-1 text-sm text-ink-soft">Ekibinize yeni bir üye ekleyin.</p>
      </div>
      <StaffMemberForm />
    </div>
  );
}
