"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { SwitchField } from "@/components/admin/fields/switch-field";
import { SaveBar } from "@/components/admin/save-bar";
import { createFaqAction, updateFaqAction } from "@/lib/admin/actions/faqs";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminFaq, MetaOption } from "@/lib/admin/types";

export function FaqForm({ faq, categories }: { faq?: AdminFaq; categories: MetaOption[] }) {
  const action = faq ? updateFaqAction.bind(null, faq.id) : createFaqAction;
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const errors = formState.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="col-span-full font-display text-base font-bold text-ink">Soru</h2>

        <FieldShell
          label="Kategori"
          htmlFor="category"
          required
          hint="SSS sayfasında sorular bu kategoriye göre gruplanır."
          error={errors.category?.[0]}
        >
          <Select name="category" defaultValue={faq?.category ?? categories[0]?.value} items={categories}>
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

        <FieldShell label="Sıra" htmlFor="sortOrder" required hint="Kategori içindeki sıra." error={errors.sortOrder?.[0]}>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={faq?.sortOrder ?? 0} required />
        </FieldShell>

        <FieldShell label="Soru" htmlFor="question" required error={errors.question?.[0]}>
          <Input id="question" name="question" defaultValue={faq?.question} required maxLength={255} className="sm:col-span-2" />
        </FieldShell>

        <FieldShell label="Cevap" htmlFor="answer" required error={errors.answer?.[0]}>
          <Textarea id="answer" name="answer" defaultValue={faq?.answer} required rows={4} className="sm:col-span-2" />
        </FieldShell>

        <SwitchField name="isPublished" label="Yayında" hint="Kapatılırsa soru sitede görünmez." defaultChecked={faq?.isPublished ?? true} />
      </section>

      <SaveBar isPending={isPending} cancelHref="/admin/sss" error={formState.status === "error" ? formState.message : undefined} state={formState} />
    </form>
  );
}
