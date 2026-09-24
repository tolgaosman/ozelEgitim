"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { GripVertical, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { uploadMediaAction } from "@/lib/admin/actions/media";

type ImageListFieldProps = {
  name: string;
  label: string;
  directory: "programs" | "announcements" | "staff" | "page-content";
  defaultValue: string[];
  hint?: string;
  error?: string;
  minItems?: number;
  maxItems?: number;
  /** Sabit sayıda görsel (ör. tam 4 kampüs fotoğrafı) — ekleme/kaldırma gizlenir. */
  fixedCount?: boolean;
};

function GalleryItem({
  src,
  isUploading,
  onReplace,
  onRemove,
  canRemove,
  draggable,
}: {
  src: string;
  isUploading: boolean;
  onReplace: (file: File) => void;
  onRemove: () => void;
  canRemove: boolean;
  draggable: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center gap-2 rounded-xl border border-border bg-white p-2">
      {draggable ? (
        <span className="cursor-grab text-ink-faint active:cursor-grabbing">
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
      ) : null}
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-paper text-ink-faint">
        {src ? (
          <Image src={src} alt="" fill sizes="64px" className="object-cover" unoptimized={src.startsWith("blob:")} />
        ) : (
          <ImagePlus className="size-5" aria-hidden="true" />
        )}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900/40">
            <Loader2 className="size-4 animate-spin text-white" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onReplace(file);
          event.target.value = "";
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        Değiştir
      </Button>
      {canRemove ? (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Kaldır">
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

/** Sabit sayıda veya değişken sayıda görsel listesi — hero slaytları, galeri gibi. */
export function ImageListField({
  name,
  label,
  directory,
  defaultValue,
  hint,
  error,
  minItems = 1,
  maxItems,
  fixedCount = false,
}: ImageListFieldProps) {
  const [items, setItems] = useState<{ id: string; src: string }[]>(() =>
    defaultValue.map((src) => ({ id: crypto.randomUUID(), src })),
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const canAdd = !fixedCount && (maxItems === undefined || items.length < maxItems);
  const canRemove = !fixedCount && items.length > minItems;

  function upload(id: string, file: File): void {
    setUploadingId(id);
    const localPreview = URL.createObjectURL(file);
    setItems((current) => current.map((entry) => (entry.id === id ? { ...entry, src: localPreview } : entry)));

    const formData = new FormData();
    formData.set("file", file);
    formData.set("directory", directory);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      setUploadingId(null);
      if (result.error || !result.url) {
        toast.error(result.error ?? "Görsel yüklenemedi.");
        return;
      }
      const uploadedUrl = result.url;
      setItems((current) => current.map((entry) => (entry.id === id ? { ...entry, src: uploadedUrl } : entry)));
    });
  }

  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input type="hidden" name={name} value={JSON.stringify(items.map((item) => item.src))} />
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <GalleryItem
              src={item.src}
              isUploading={uploadingId === item.id}
              draggable={!fixedCount}
              canRemove={canRemove}
              onReplace={(file) => upload(item.id, file)}
              onRemove={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {canAdd ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), src: "" }])}
        >
          <Plus className="size-3.5" />
          Görsel ekle
        </Button>
      ) : null}
    </FieldShell>
  );
}
