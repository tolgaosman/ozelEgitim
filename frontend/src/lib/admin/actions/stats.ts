"use server";

import { updateTag, revalidatePath } from "next/cache";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { AdminSiteStat } from "@/lib/admin/types";

export type StatFormState = { status: "idle" | "error"; message?: string };

function buildStatPayload(formData: FormData): Record<string, unknown> {
  return {
    label: String(formData.get("label") ?? ""),
    targetValue: Number(formData.get("targetValue") ?? 0),
    suffix: String(formData.get("suffix") ?? ""),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createStatAction(formData: FormData): Promise<{ error?: string }> {
  try {
    await adminMutate<{ data: AdminSiteStat }>("/api/admin/site-stats", "POST", buildStatPayload(formData));
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Eklenemedi." };
  }
  updateTag("site-settings");
  revalidatePath("/admin/ayarlar");
  return {};
}

export async function updateStatAction(statId: number, formData: FormData): Promise<{ error?: string }> {
  try {
    await adminMutate<{ data: AdminSiteStat }>(`/api/admin/site-stats/${statId}`, "PUT", buildStatPayload(formData));
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Güncellenemedi." };
  }
  updateTag("site-settings");
  revalidatePath("/admin/ayarlar");
  return {};
}

export async function deleteStatAction(statId: number): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/site-stats/${statId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("site-settings");
  revalidatePath("/admin/ayarlar");
  return {};
}

export async function reorderStatsAction(orderedIds: number[]): Promise<{ error?: string }> {
  try {
    await adminMutate("/api/admin/site-stats/reorder", "POST", { ids: orderedIds });
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Sıralama kaydedilemedi." };
  }
  updateTag("site-settings");
  revalidatePath("/admin/ayarlar");
  return {};
}
