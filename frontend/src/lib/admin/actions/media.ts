"use server";

import { AdminApiError, adminUploadMedia } from "@/lib/admin/client";

export type MediaUploadResult = { path: string; url: string; error?: undefined } | { error: string; path?: undefined; url?: undefined };

/**
 * `ImageUploadField` (client) tarafından doğrudan çağrılır — bir forma bağlı
 * değildir, kullanıcı dosya seçer seçmez yüklenir ve sonuç hemen önizlenir.
 */
export async function uploadMediaAction(formData: FormData): Promise<MediaUploadResult> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Bir dosya seçin." };
  }

  try {
    return await adminUploadMedia(formData);
  } catch (error) {
    console.error("Upload error details:", error);
    if (error instanceof AdminApiError) {
      const firstFieldError = error.body?.errors?.file?.[0];
      return { error: firstFieldError ?? error.message };
    }
    return { error: "Görsel yüklenemedi." };
  }
}
