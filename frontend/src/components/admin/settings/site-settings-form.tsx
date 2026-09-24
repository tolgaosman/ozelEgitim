"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { StringListField } from "@/components/admin/fields/string-list-field";
import { SaveBar } from "@/components/admin/save-bar";
import { updateSiteSettingsAction } from "@/lib/admin/actions/settings";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminSiteSettings } from "@/lib/admin/types";

export function SiteSettingsForm({ settings }: { settings: AdminSiteSettings }) {
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(
    updateSiteSettingsAction,
    INITIAL_RESOURCE_FORM_STATE,
  );
  const errors = formState.errors ?? {};

  useEffect(() => {
    if (formState.status === "idle" && formState.message) {
      toast.success(formState.message);
    }
  }, [formState]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">İletişim</h2>

        <FieldShell label="Telefon (görünen)" htmlFor="phoneDisplay" required error={errors.phoneDisplay?.[0]}>
          <Input id="phoneDisplay" name="phoneDisplay" defaultValue={settings.contact.phoneDisplay} required />
        </FieldShell>

        <FieldShell label="Telefon (tel: bağlantısı)" htmlFor="phoneTel" required hint="Örn. +905338881405" error={errors.phoneTel?.[0]}>
          <Input id="phoneTel" name="phoneTel" defaultValue={settings.contact.phoneTel} required />
        </FieldShell>

        <FieldShell label="WhatsApp bağlantısı" htmlFor="whatsappUrl" required error={errors.whatsappUrl?.[0]}>
          <Input id="whatsappUrl" name="whatsappUrl" type="url" defaultValue={settings.contact.whatsappUrl} required />
        </FieldShell>

        <FieldShell
          label="E-posta"
          htmlFor="email"
          required
          hint="Bu adres aynı zamanda yönetim paneli giriş hesabınızdır."
          error={errors.email?.[0]}
        >
          <Input id="email" name="email" type="email" defaultValue={settings.contact.email} required />
        </FieldShell>

        <FieldShell label="Adres" htmlFor="address" required error={errors.address?.[0]}>
          <Input id="address" name="address" defaultValue={settings.contact.address} required className="sm:col-span-2" />
        </FieldShell>

        <FieldShell label="Google Haritalar bağlantısı" htmlFor="mapsUrl" required error={errors.mapsUrl?.[0]}>
          <Input id="mapsUrl" name="mapsUrl" type="url" defaultValue={settings.contact.mapsUrl} required className="sm:col-span-2" />
        </FieldShell>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-3 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Çalışma Saatleri</h2>

        <FieldShell label="Hafta İçi" htmlFor="weekdayHours" required error={errors.weekdayHours?.[0]}>
          <Input id="weekdayHours" name="weekdayHours" defaultValue={settings.openingHours.weekday} required />
        </FieldShell>
        <FieldShell label="Cumartesi" htmlFor="saturdayHours" required error={errors.saturdayHours?.[0]}>
          <Input id="saturdayHours" name="saturdayHours" defaultValue={settings.openingHours.saturday} required />
        </FieldShell>
        <FieldShell label="Pazar" htmlFor="sundayHours" required error={errors.sundayHours?.[0]}>
          <Input id="sundayHours" name="sundayHours" defaultValue={settings.openingHours.sunday} required />
        </FieldShell>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-3 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Sosyal Medya</h2>
        <p className="col-span-full -mt-3 text-sm text-ink-soft">Boş bırakılan bir bağlantı sitede hiç gösterilmez.</p>

        <FieldShell label="Instagram" htmlFor="instagramUrl" error={errors.instagramUrl?.[0]}>
          <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={settings.socialLinks.instagram ?? ""} />
        </FieldShell>
        <FieldShell label="Facebook" htmlFor="facebookUrl" error={errors.facebookUrl?.[0]}>
          <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={settings.socialLinks.facebook ?? ""} />
        </FieldShell>
        <FieldShell label="YouTube" htmlFor="youtubeUrl" error={errors.youtubeUrl?.[0]}>
          <Input id="youtubeUrl" name="youtubeUrl" type="url" defaultValue={settings.socialLinks.youtube ?? ""} />
        </FieldShell>
      </section>

      <section className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">KVKK Aydınlatma Metni</h2>
        <p className="mt-1 text-sm text-ink-soft">Her paragraf sayfada ayrı bir metin bloğu olarak görünür.</p>
        <div className="mt-4">
          <StringListField
            name="kvkkBody"
            label="Paragraflar"
            defaultValue={settings.kvkkBody}
            addLabel="Paragraf ekle"
            error={errors.kvkkBody?.[0]}
          />
        </div>
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
