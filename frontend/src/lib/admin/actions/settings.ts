"use server";

import { updateTag, revalidatePath } from "next/cache";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminSiteSettings } from "@/lib/admin/types";

function readJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function updateSiteSettingsAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  const payload = {
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    phoneTel: String(formData.get("phoneTel") ?? ""),
    whatsappUrl: String(formData.get("whatsappUrl") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    mapsUrl: String(formData.get("mapsUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
    facebookUrl: String(formData.get("facebookUrl") ?? "") || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "") || null,
    weekdayHours: String(formData.get("weekdayHours") ?? ""),
    saturdayHours: String(formData.get("saturdayHours") ?? ""),
    sundayHours: String(formData.get("sundayHours") ?? ""),
    kvkkBody: readJsonField<string[]>(formData, "kvkkBody", []),
  };

  try {
    await adminMutate<{ data: AdminSiteSettings }>("/api/admin/site-settings", "PUT", payload);
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? error.message, errors: error.body?.errors };
    }
    return { status: "error", message: "Beklenmeyen bir hata oluştu." };
  }

  updateTag("site-settings");
  revalidatePath("/admin/ayarlar");
  
  return { status: "success", message: "Ayarlar kaydedildi." };
}
