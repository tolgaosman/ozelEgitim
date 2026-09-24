"use server";

import { updateTag } from "next/cache";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { PageContentKey } from "@/lib/schemas/page-content";

/** Basit metin alanları doğrudan `FormData`'dan, liste alanları gizli JSON input'lardan okunur. */
function buildBlockPayload(formData: FormData, listFieldKeys: string[]): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;

    if (listFieldKeys.includes(key)) {
      try {
        payload[key] = JSON.parse(value);
      } catch {
        payload[key] = [];
      }
      continue;
    }

    payload[key] = value;
  }

  return payload;
}

export async function updatePageContentBlockAction(
  blockKey: PageContentKey,
  listFieldKeys: string[],
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  try {
    await adminMutate(`/api/admin/page-contents/${blockKey}`, "PUT", buildBlockPayload(formData, listFieldKeys));
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? error.message, errors: error.body?.errors };
    }
    return { status: "error", message: "Beklenmeyen bir hata oluştu." };
  }

  updateTag("page-content");
  return { status: "success", message: "Sayfa içeriği kaydedildi." };
}

export async function resetPageContentBlockAction(blockKey: PageContentKey): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/page-contents/${blockKey}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Sıfırlanamadı." };
  }
  updateTag("page-content");
  return {};
}
