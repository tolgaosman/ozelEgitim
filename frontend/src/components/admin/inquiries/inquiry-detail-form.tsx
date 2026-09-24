"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { SaveBar } from "@/components/admin/save-bar";
import { updateInquiryAction } from "@/lib/admin/actions/inquiries";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { AdminInquiry, MetaOption } from "@/lib/admin/types";

export function InquiryDetailForm({ inquiry, statuses }: { inquiry: AdminInquiry; statuses: (MetaOption & { color: string })[] }) {
  const action = updateInquiryAction.bind(null, inquiry.id);
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">Merkez takibi</h2>

      <FieldShell label="Durum" htmlFor="status" required error={formState.errors?.status?.[0]}>
        <Select name="status" defaultValue={inquiry.status} items={statuses}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldShell>

      <FieldShell
        label="İç not"
        htmlFor="internalNote"
        hint="Yalnızca ekip görür; veliye hiçbir şekilde gösterilmez."
        error={formState.errors?.internalNote?.[0]}
      >
        <Textarea id="internalNote" name="internalNote" defaultValue={inquiry.internalNote ?? ""} rows={4} />
      </FieldShell>

      <SaveBar
        isPending={isPending}
        cancelHref="/admin/talepler"
        saveLabel="Kaydet"
        error={formState.status === "error" ? formState.message : undefined}
        state={formState}
      />
    </form>
  );
}
