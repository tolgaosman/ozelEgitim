"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { SwitchField } from "@/components/admin/fields/switch-field";
import { SaveBar } from "@/components/admin/save-bar";
import { createTestimonialAction, updateTestimonialAction } from "@/lib/admin/actions/testimonials";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminTestimonial, MetaOption } from "@/lib/admin/types";

export function TestimonialForm({ testimonial, programs }: { testimonial?: AdminTestimonial; programs: MetaOption<number>[] }) {
  const action = testimonial ? updateTestimonialAction.bind(null, testimonial.id) : createTestimonialAction;
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const errors = formState.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Veli görüşü</h2>

        <FieldShell
          label="Veli adı"
          htmlFor="parentName"
          required
          hint="KVKK gereği gerçek ad yerine kısaltılmış bir ifade tercih edilmelidir."
          error={errors.parentName?.[0]}
        >
          <Input id="parentName" name="parentName" defaultValue={testimonial?.parentName} required maxLength={255} />
        </FieldShell>

        <FieldShell label="Yakınlık" htmlFor="relationLabel" required error={errors.relationLabel?.[0]}>
          <Input
            id="relationLabel"
            name="relationLabel"
            defaultValue={testimonial?.relationLabel}
            placeholder="8 yaşındaki oğlunun annesi"
            required
            maxLength={255}
          />
        </FieldShell>

        <FieldShell label="Görüş metni" htmlFor="quote" required error={errors.quote?.[0]}>
          <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} required rows={4} className="sm:col-span-2" />
        </FieldShell>

        <FieldShell label="İlgili program" htmlFor="programId" hint="İsteğe bağlı." error={errors.programId?.[0]}>
          <Select
            name="programId"
            defaultValue={testimonial?.programId ? String(testimonial.programId) : "none"}
            items={[{ value: "none", label: "Belirtilmemiş" }, ...programs.map((program) => ({ value: String(program.value), label: program.label }))]}
          >
            <SelectTrigger id="programId" className="w-full">
              <SelectValue placeholder="Program seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Belirtilmemiş</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program.value} value={String(program.value)}>
                  {program.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>

        <FieldShell label="Sıra" htmlFor="sortOrder" required error={errors.sortOrder?.[0]}>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={testimonial?.sortOrder ?? 0} required />
        </FieldShell>

        <div className="sm:col-span-2">
          <SwitchField
            name="isPublished"
            label="Yayında"
            hint="Bir veli görüşü yalnızca yazılı onay alındıktan sonra yayına alınmalıdır (KVKK)."
            defaultChecked={testimonial?.isPublished ?? false}
          />
        </div>
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin/veli-yorumlari" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
