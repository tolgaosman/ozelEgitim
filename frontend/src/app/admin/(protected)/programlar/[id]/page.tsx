import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta, AdminProgram } from "@/lib/admin/types";

export const metadata = { title: "Programı Düzenle" };

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: program }, { data: meta }] = await Promise.all([
    adminGet<{ data: AdminProgram }>(`/api/admin/programs/${id}`),
    adminGet<{ data: AdminMeta }>("/api/admin/meta"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{program.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">Program bilgilerini düzenleyin.</p>
        </div>
        {program.isPublished ? (
          <Link
            href={`/programlar/${program.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-800 hover:underline"
          >
            Sitede gör <ExternalLink className="size-3.5" />
          </Link>
        ) : null}
      </div>
      <ProgramForm program={program} programIcons={meta.programIcons} />
    </div>
  );
}
