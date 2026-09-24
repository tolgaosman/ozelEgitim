"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { ImageUploadField } from "@/components/admin/fields/image-upload-field";
import { StringListField } from "@/components/admin/fields/string-list-field";
import { SaveBar } from "@/components/admin/save-bar";
import { createAnnouncementAction, updateAnnouncementAction } from "@/lib/admin/actions/announcements";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminAnnouncement, MetaOption } from "@/lib/admin/types";
import { toDateTimeLocalValue } from "@/lib/admin/datetime";

export function AnnouncementForm({
  announcement,
  categories,
}: {
  announcement?: AdminAnnouncement;
  categories: MetaOption[];
}) {
  const action = announcement ? updateAnnouncementAction.bind(null, announcement.id, announcement.slug) : createAnnouncementAction;
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const errors = formState.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Duyuru</h2>

        <FieldShell label="Başlık" htmlFor="title" required error={errors.title?.[0]}>
          <Input id="title" name="title" defaultValue={announcement?.title} required maxLength={255} />
        </FieldShell>

        <FieldShell label="URL kısaltması" htmlFor="slug" required hint="Sitedeki adres: /duyurular/<kısaltma>." error={errors.slug?.[0]}>
          <Input id="slug" name="slug" defaultValue={announcement?.slug} required maxLength={255} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
        </FieldShell>

        <FieldShell label="Kategori" htmlFor="category" required error={errors.category?.[0]}>
          <Select name="category" defaultValue={announcement?.category ?? categories[0]?.value} items={categories}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>

        <ImageUploadField
          name="imagePath"
          label="Kapak görseli"
          directory="announcements"
          defaultPath={announcement?.imagePath}
          defaultUrl={announcement?.imageUrl}
          error={errors.imagePath?.[0]}
        />

        <FieldShell
          label="Özet"
          htmlFor="excerpt"
          required
          hint="Duyuru listesinde görünen kısa tanıtım metni."
          error={errors.excerpt?.[0]}
        >
          <Textarea id="excerpt" name="excerpt" defaultValue={announcement?.excerpt} required rows={2} maxLength={255} className="sm:col-span-2" />
        </FieldShell>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Metin</h2>
        <p className="mt-1 text-sm text-ink-soft">Her paragraf duyuru sayfasında ayrı bir metin bloğu olarak görünür.</p>
        <div className="mt-4">
          <StringListField
            name="body"
            label="Paragraflar"
            defaultValue={announcement?.body ?? [""]}
            addLabel="Paragraf ekle"
            placeholder="Paragraf metni"
            error={errors.body?.[0]}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Yayın</h2>

        <FieldShell
          label="Yayın tarihi"
          htmlFor="publishedAt"
          hint="Duyurular sitede bu tarihe göre yeniden eskiye sıralanır. Boş bırakılırsa taslakta kalır."
          error={errors.publishedAt?.[0]}
        >
          <Input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocalValue(announcement?.publishedAt)} />
        </FieldShell>

        <FieldShell label="Sıra" htmlFor="sortOrder" required error={errors.sortOrder?.[0]}>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={announcement?.sortOrder ?? 0} required />
        </FieldShell>
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin/duyurular" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
