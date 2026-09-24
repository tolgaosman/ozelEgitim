"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { ImageUploadField } from "@/components/admin/fields/image-upload-field";
import { ImageListField } from "@/components/admin/fields/image-list-field";
import { StringListField } from "@/components/admin/fields/string-list-field";
import { ObjectListField } from "@/components/admin/fields/object-list-field";
import { resetPageContentBlockAction, updatePageContentBlockAction } from "@/lib/admin/actions/page-content";
import { INITIAL_RESOURCE_FORM_STATE, type ResourceFormState } from "@/lib/admin/form-state";
import type { PageContentBlockConfig } from "@/lib/admin/page-content-config";
import type { PageContentKey } from "@/lib/schemas/page-content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockContent = Record<string, any>;

export function PageContentBlockForm({ config, content, isCustomized }: { config: PageContentBlockConfig; content: BlockContent; isCustomized: boolean }) {
  const listFieldKeys = config.fields.filter((field) => field.type !== "text" && field.type !== "textarea" && field.type !== "image").map((field) => field.key);
  const action = updatePageContentBlockAction.bind(null, config.key as PageContentKey, listFieldKeys);
  const [formState, formAction, isPending] = useActionState<ResourceFormState, FormData>(action, INITIAL_RESOURCE_FORM_STATE);
  const [isResetting, setIsResetting] = useState(false);
  const errors = formState.errors ?? {};

  useEffect(() => {
    if (formState.status === "idle" && formState.message) {
      toast.success(formState.message);
    }
  }, [formState]);

  function handleReset(): void {
    setIsResetting(true);
    resetPageContentBlockAction(config.key as PageContentKey)
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Varsayılana döndürüldü. Sayfa yenileniyor…");
        window.location.reload();
      })
      .finally(() => setIsResetting(false));
  }

  return (
    <details className="group rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] open:shadow-sm" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-base font-bold text-ink">{config.title}</h2>
          {config.description ? <p className="mt-0.5 text-sm text-ink-soft">{config.description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {isCustomized ? <span className="rounded-full bg-aqua-100 px-2.5 py-1 text-xs font-bold text-navy-800">Düzenlendi</span> : null}
          <span className="text-ink-faint transition-transform group-open:rotate-180">▾</span>
        </div>
      </summary>

      <form action={formAction} className="space-y-4 border-t border-border p-5 sm:p-6">
        {config.fields.map((field) => {
          const value = content[field.key];
          const error = errors[field.key]?.[0];

          if (field.type === "text") {
            return (
              <FieldShell key={field.key} label={field.label} htmlFor={`${config.key}-${field.key}`} hint={field.hint} error={error}>
                <Input id={`${config.key}-${field.key}`} name={field.key} defaultValue={value ?? ""} />
              </FieldShell>
            );
          }

          if (field.type === "textarea") {
            return (
              <FieldShell key={field.key} label={field.label} htmlFor={`${config.key}-${field.key}`} hint={field.hint} error={error}>
                <Textarea id={`${config.key}-${field.key}`} name={field.key} defaultValue={value ?? ""} rows={field.rows ?? 3} />
              </FieldShell>
            );
          }

          if (field.type === "image") {
            return (
              <ImageUploadField
                key={field.key}
                name={field.key}
                label={field.label}
                directory="page-content"
                defaultUrl={typeof value === "string" ? value : ""}
                valueMode="url"
                hint={field.hint}
                error={error}
              />
            );
          }

          if (field.type === "string-list" || field.type === "keyword-list") {
            return (
              <StringListField
                key={field.key}
                name={field.key}
                label={field.label}
                defaultValue={Array.isArray(value) ? value : []}
                hint={field.hint}
                error={error}
                minItems={"min" in field ? field.min : 1}
                maxItems={"max" in field ? field.max : undefined}
                placeholder={field.type === "keyword-list" ? "Anahtar kelime" : undefined}
              />
            );
          }

          if (field.type === "image-list") {
            return (
              <ImageListField
                key={field.key}
                name={field.key}
                label={field.label}
                directory="page-content"
                defaultValue={Array.isArray(value) ? value : []}
                hint={field.hint}
                error={error}
                minItems={field.min}
                maxItems={field.max}
                fixedCount={field.fixedCount}
              />
            );
          }

          return (
            <ObjectListField
              key={field.key}
              name={field.key}
              label={field.label}
              fields={field.itemFields}
              defaultValue={Array.isArray(value) ? value : []}
              emptyRow={Object.fromEntries(field.itemFields.map((itemField) => [itemField.key, ""]))}
              hint={field.hint}
              error={error}
              minItems={field.min}
              maxItems={field.max}
              fixedCount={field.fixedCount}
            />
          );
        })}

        {formState.status === "error" ? (
          <p role="alert" className="text-sm font-medium text-signal">
            {formState.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Kaydet
          </Button>
          {isCustomized ? (
            <Button type="button" variant="ghost" size="sm" onClick={handleReset} disabled={isResetting}>
              <RotateCcw className="size-3.5" />
              Varsayılana Döndür
            </Button>
          ) : null}
        </div>
      </form>
    </details>
  );
}
