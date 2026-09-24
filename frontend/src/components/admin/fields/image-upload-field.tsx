"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { uploadMediaAction } from "@/lib/admin/actions/media";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  directory: "programs" | "announcements" | "staff" | "page-content";
  defaultPath?: string | null;
  defaultUrl?: string | null;
  hint?: string;
  error?: string;
  /** Yuvarlak (avatar) önizleme — kadro fotoğrafları için. */
  round?: boolean;
  /**
   * "path" (varsayılan): gizli input'a depolama yolu yazılır (`imagePath`,
   * `photoPath` gibi sütunlar bunu bekler). "url": gizli input'a mutlak URL
   * yazılır — sayfa içeriği bloklarında kullanılır, zira backend orada zaten
   * çözümlenmiş bir URL saklar ve `ImageListField` ile aynı sözleşmeyi paylaşır.
   */
  valueMode?: "path" | "url";
};

/**
 * Dosya seçilir seçilmez `/api/admin/media`'ya yüklenir ve gizli input'a
 * dönen depolama yolu veya URL'i (`valueMode`'a göre) yazılır — form
 * gönderildiğinde asıl kaynağın alanına bu değer gider. Önizleme her zaman en
 * son yüklenen görseli veya mevcut kaydın görselini gösterir.
 */
export function ImageUploadField({
  name,
  label,
  directory,
  defaultPath,
  defaultUrl,
  hint,
  error,
  round,
  valueMode = "path",
}: ImageUploadFieldProps) {
  const initialValue = valueMode === "url" ? (defaultUrl ?? defaultPath ?? "") : (defaultPath ?? "");
  const [storedValue, setStoredValue] = useState(initialValue);
  const [previewUrl, setPreviewUrl] = useState(defaultUrl ?? defaultPath ?? "");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("directory", directory);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.error) {
        toast.error(result.error);
        setPreviewUrl(defaultUrl ?? "");
        return;
      }
      // `result` artık {path, url} — TypeScript'e discriminated union'ı yeniden daralt.
      if (!result.path || !result.url) return;
      setStoredValue(valueMode === "url" ? result.url : result.path);
      setPreviewUrl(result.url);
    });

    event.target.value = "";
  }

  function handleRemove(): void {
    setStoredValue("");
    setPreviewUrl("");
  }

  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input type="hidden" name={name} value={storedValue} />
      <div className="flex items-center gap-4">
        <div
          className={`relative flex size-20 shrink-0 items-center justify-center overflow-hidden border border-dashed border-border bg-paper text-ink-faint ${round ? "rounded-full" : "rounded-lg"}`}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="" fill sizes="80px" className="object-cover" unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("http")} />
          ) : (
            <ImagePlus className="size-6" aria-hidden="true" />
          )}
          {isPending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-navy-900/40">
              <Loader2 className="size-5 animate-spin text-white" aria-hidden="true" />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
            {previewUrl ? "Değiştir" : "Görsel Yükle"}
          </Button>
          {previewUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-faint hover:text-signal"
            >
              <X className="size-3" aria-hidden="true" />
              Kaldır
            </button>
          ) : null}
        </div>
      </div>
    </FieldShell>
  );
}
