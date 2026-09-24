"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { ImageUploadField } from "@/components/admin/fields/image-upload-field";
import { StringListField } from "@/components/admin/fields/string-list-field";
import { ObjectListField } from "@/components/admin/fields/object-list-field";
import { SaveBar } from "@/components/admin/save-bar";
import { createProgramAction, updateProgramAction } from "@/lib/admin/actions/programs";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminProgram, MetaOption } from "@/lib/admin/types";
import { toDateTimeLocalValue } from "@/lib/admin/datetime";

type ProgramFormProps = {
  program?: AdminProgram;
  programIcons: MetaOption[];
};

export function ProgramForm({ program, programIcons }: ProgramFormProps) {
  const action = program ? updateProgramAction.bind(null, program.id, program.slug) : createProgramAction;
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const errors = formState.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Tanım</h2>

        <FieldShell label="Program adı" htmlFor="name" required error={errors.name?.[0]}>
          <Input id="name" name="name" defaultValue={program?.name} required maxLength={255} />
        </FieldShell>

        <FieldShell
          label="URL kısaltması"
          htmlFor="slug"
          required
          hint="Sitedeki adres: /programlar/<kısaltma>. Yayındaki bir programda değiştirmek eski bağlantıları kırar."
          error={errors.slug?.[0]}
        >
          <Input id="slug" name="slug" defaultValue={program?.slug} required maxLength={255} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
        </FieldShell>

        <FieldShell label="Kısa açıklama" htmlFor="shortDescription" required error={errors.shortDescription?.[0]} hint="Program kartlarında görünen tek cümlelik özet.">
          <Textarea id="shortDescription" name="shortDescription" defaultValue={program?.shortDescription} required rows={2} maxLength={255} className="sm:col-span-2" />
        </FieldShell>

        <FieldShell label="Kart ikonu" htmlFor="icon" required error={errors.icon?.[0]}>
          <Select name="icon" defaultValue={program?.icon ?? programIcons[0]?.value} items={programIcons}>
            <SelectTrigger id="icon" className="w-full">
              <SelectValue placeholder="İkon seçin" />
            </SelectTrigger>
            <SelectContent>
              {programIcons.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>

        <ImageUploadField
          name="imagePath"
          label="Program görseli"
          directory="programs"
          defaultPath={program?.imagePath}
          defaultUrl={program?.imageUrl}
          hint="Boş bırakılırsa site kendi yer tutucu görselini kullanır."
          error={errors.imagePath?.[0]}
        />

        <FieldShell label="Yaş aralığı" htmlFor="ageRangeLabel" required error={errors.ageRangeLabel?.[0]}>
          <Input id="ageRangeLabel" name="ageRangeLabel" defaultValue={program?.ageRangeLabel} placeholder="6-14 yaş" required maxLength={255} />
        </FieldShell>

        <FieldShell label="Seans biçimi" htmlFor="sessionFormatLabel" required error={errors.sessionFormatLabel?.[0]}>
          <Input
            id="sessionFormatLabel"
            name="sessionFormatLabel"
            defaultValue={program?.sessionFormatLabel}
            placeholder="Bire bir, haftada 2-3 seans"
            required
            maxLength={255}
          />
        </FieldShell>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Detay metni</h2>
        <p className="mt-1 text-sm text-ink-soft">Her paragraf program sayfasında ayrı bir metin bloğu olarak görünür.</p>
        <div className="mt-4">
          <StringListField
            name="description"
            label="Paragraflar"
            defaultValue={program?.description ?? [""]}
            addLabel="Paragraf ekle"
            placeholder="Paragraf metni"
            error={errors.description?.[0]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Öne çıkanlar</h2>
        <p className="mt-1 text-sm text-ink-soft">Program sayfasındaki maddeler. En az 1, en fazla 6 madde girilebilir.</p>
        <div className="mt-4">
          <ObjectListField
            name="highlights"
            label="Maddeler"
            fields={[
              { key: "title", label: "Başlık" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ]}
            defaultValue={program?.highlights ?? [{ title: "", description: "" }]}
            emptyRow={{ title: "", description: "" }}
            maxItems={6}
            addLabel="Madde ekle"
            error={errors.highlights?.[0]}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Yayın</h2>

        <FieldShell
          label="Yayın tarihi"
          htmlFor="publishedAt"
          hint="Boş bırakılırsa program taslakta kalır ve sitede hiç görünmez."
          error={errors.publishedAt?.[0]}
        >
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(program?.publishedAt)}
          />
        </FieldShell>

        <FieldShell label="Sıra" htmlFor="sortOrder" required hint="Küçük sayı önce gösterilir." error={errors.sortOrder?.[0]}>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={program?.sortOrder ?? 0} required />
        </FieldShell>
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin/programlar" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
