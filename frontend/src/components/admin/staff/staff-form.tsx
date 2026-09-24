"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { ImageUploadField } from "@/components/admin/fields/image-upload-field";
import { StringListField } from "@/components/admin/fields/string-list-field";
import { SaveBar } from "@/components/admin/save-bar";
import { createStaffMemberAction, updateStaffMemberAction } from "@/lib/admin/actions/staff";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminStaffMember } from "@/lib/admin/types";

export function StaffMemberForm({ staffMember }: { staffMember?: AdminStaffMember }) {
  const action = staffMember ? updateStaffMemberAction.bind(null, staffMember.id) : createStaffMemberAction;
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const errors = formState.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Ekip üyesi</h2>

        <FieldShell label="Ad soyad" htmlFor="fullName" required error={errors.fullName?.[0]}>
          <Input id="fullName" name="fullName" defaultValue={staffMember?.fullName} required maxLength={255} />
        </FieldShell>

        <FieldShell label="URL kısaltması" htmlFor="slug" required error={errors.slug?.[0]}>
          <Input id="slug" name="slug" defaultValue={staffMember?.slug} required maxLength={255} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
        </FieldShell>

        <FieldShell label="Unvan" htmlFor="title" required error={errors.title?.[0]}>
          <Input
            id="title"
            name="title"
            defaultValue={staffMember?.title}
            placeholder="Dil ve Konuşma Terapisti, Klinik Koordinatör"
            required
            maxLength={255}
          />
        </FieldShell>

        <ImageUploadField
          name="photoPath"
          label="Fotoğraf"
          directory="staff"
          defaultPath={staffMember?.photoPath}
          defaultUrl={staffMember?.photoUrl}
          hint="Boş bırakılırsa sitede ad-soyad baş harflerinden oluşan avatar gösterilir. (Görsel 3:4 formatında gösterilir)"
          error={errors.photoPath?.[0]}
        />

        <FieldShell label="Kısa biyografi" htmlFor="bio" required error={errors.bio?.[0]}>
          <Textarea id="bio" name="bio" defaultValue={staffMember?.bio} required rows={3} className="sm:col-span-2" />
        </FieldShell>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Uzmanlık alanları</h2>
        <p className="mt-1 text-sm text-ink-soft">Kadro kartında etiket olarak görünür. En az 1, en fazla 5 alan girilebilir.</p>
        <div className="mt-4">
          <StringListField
            name="specialties"
            label="Alanlar"
            defaultValue={staffMember?.specialties ?? [""]}
            addLabel="Alan ekle"
            placeholder="Uzmanlık alanı"
            maxItems={5}
            error={errors.specialties?.[0]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Eğitim bilgileri</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Detay kartında görünür (eğitim düzeyi, okul/kurum). En az 1, en fazla 6 satır girilebilir.
        </p>
        <div className="mt-4">
          <StringListField
            name="education"
            label="Eğitim"
            defaultValue={staffMember?.education ?? [""]}
            addLabel="Satır ekle"
            placeholder="Lisans, Özel Eğitim Öğretmenliği, Ankara Üniversitesi"
            maxItems={6}
            error={errors.education?.[0]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Sıralama</h2>
        <div className="mt-4 max-w-xs">
          <FieldShell label="Sıra" htmlFor="sortOrder" required hint="Küçük sayı önce gösterilir." error={errors.sortOrder?.[0]}>
            <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={staffMember?.sortOrder ?? 0} required />
          </FieldShell>
        </div>
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin/kadro" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
