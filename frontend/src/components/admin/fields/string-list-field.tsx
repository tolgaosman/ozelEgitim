"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "@/components/admin/fields/field-shell";

type StringListFieldProps = {
  name: string;
  label: string;
  defaultValue: string[];
  hint?: string;
  error?: string;
  addLabel?: string;
  placeholder?: string;
  minItems?: number;
  maxItems?: number;
};

/**
 * Serbest metin paragrafı/madde listeleri için (program açıklaması, duyuru
 * metni, uzmanlık alanları, KVKK paragrafları). Form gönderiminde tek bir
 * gizli `input`a JSON dizisi olarak yazılır; sunucu action'ı bunu doğrudan
 * `JSON.parse` eder — Filament'teki `Repeater::simple()` karşılığı.
 */
export function StringListField({
  name,
  label,
  defaultValue,
  hint,
  error,
  addLabel = "Ekle",
  placeholder,
  minItems = 1,
  maxItems,
}: StringListFieldProps) {
  const [items, setItems] = useState<{ id: string; value: string }[]>(
    () => (defaultValue.length > 0 ? defaultValue : [""]).map((value) => ({ id: crypto.randomUUID(), value })),
  );
  const canAdd = maxItems === undefined || items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input type="hidden" name={name} value={JSON.stringify(items.map((item) => item.value))} />
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((item, index) => (
          <Reorder.Item key={item.id} value={item} className="flex items-start gap-2">
            <span className="mt-2 cursor-grab text-ink-faint active:cursor-grabbing">
              <GripVertical className="size-4" aria-hidden="true" />
            </span>
            <Textarea
              value={item.value}
              placeholder={placeholder}
              rows={2}
              aria-label={`${label} ${index + 1}`}
              onChange={(event) =>
                setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, value: event.target.value } : entry)))
              }
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canRemove}
              onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
              aria-label="Kaldır"
            >
              <Trash2 className="size-4" />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canAdd}
        onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), value: "" }])}
        className="mt-1"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </FieldShell>
  );
}
