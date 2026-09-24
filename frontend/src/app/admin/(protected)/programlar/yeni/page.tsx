import { ProgramForm } from "@/components/admin/programs/program-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Yeni Program" };

export default async function NewProgramPage() {
  const { data: meta } = await adminGet<{ data: AdminMeta }>("/api/admin/meta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Program</h1>
        <p className="mt-1 text-sm text-ink-soft">Yeni bir destek eğitim programı ekleyin.</p>
      </div>
      <ProgramForm programIcons={meta.programIcons} />
    </div>
  );
}
