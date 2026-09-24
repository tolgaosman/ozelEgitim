"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "@/components/admin/fields/field-shell";

type ObjectListFieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea";
};

type ObjectListFieldProps<Row extends Record<string, string>> = {
  name: string;
  label: string;
  fields: ObjectListFieldConfig[];
  defaultValue: Row[];
  emptyRow: Row;
  hint?: string;
  error?: string;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  /** Sabit sayıda öğe (ör. tam 3 sütun) — ekleme/kaldırma gizlenir. */
  fixedCount?: boolean;
};

/**
 * `{title, description}` veya `{time, description}` gibi nesne dizileri
 * için genel repeater — program öne çıkanları, "Farkı Biliyoruz" sütunları,
 * değerler, tesisler, kayıt adımları ve gün akışı hep bu bileşeni kullanır.
 * Filament'teki `Repeater` alan şemasının karşılığıdır.
 */
export function ObjectListField<Row extends Record<string, string>>({
  name,
  label,
  fields,
  defaultValue,
  emptyRow,
  hint,
  error,
  addLabel = "Madde ekle",
  minItems = 1,
  maxItems,
  fixedCount = false,
}: ObjectListFieldProps<Row>) {
  const [items, setItems] = useState<{ id: string; row: Row }[]>(
    () => (defaultValue.length > 0 ? defaultValue : [emptyRow]).map((row) => ({ id: crypto.randomUUID(), row })),
  );
  const canAdd = !fixedCount && (maxItems === undefined || items.length < maxItems);
  const canRemove = !fixedCount && items.length > minItems;

  function updateField(id: string, key: string, value: string): void {
    setItems((current) => current.map((entry) => (entry.id === id ? { ...entry, row: { ...entry.row, [key]: value } } : entry)));
  }

  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input type="hidden" name={name} value={JSON.stringify(items.map((item) => item.row))} />
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="flex items-start gap-2 rounded-xl border border-border bg-paper/60 p-3"
          >
            {!fixedCount ? (
              <span className="mt-2 cursor-grab text-ink-faint active:cursor-grabbing">
                <GripVertical className="size-4" aria-hidden="true" />
              </span>
            ) : null}
            <div className="grid flex-1 gap-2">
              {fields.map((field) =>
                field.type === "textarea" ? (
                  <Textarea
                    key={field.key}
                    value={item.row[field.key] ?? ""}
                    placeholder={field.label}
                    aria-label={field.label}
                    rows={2}
                    onChange={(event) => updateField(item.id, field.key, event.target.value)}
                  />
                ) : (
                  <Input
                    key={field.key}
                    value={item.row[field.key] ?? ""}
                    placeholder={field.label}
                    aria-label={field.label}
                    onChange={(event) => updateField(item.id, field.key, event.target.value)}
                  />
                ),
              )}
            </div>
            {canRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                aria-label="Kaldır"
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {canAdd ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), row: emptyRow }])}
          className="mt-1"
        >
          <Plus className="size-3.5" />
          {addLabel}
        </Button>
      ) : null}
    </FieldShell>
  );
}
