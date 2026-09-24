"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminProgram } from "@/lib/admin/types";

function readJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function buildProgramPayload(formData: FormData): Record<string, unknown> {
  const publishedAt = String(formData.get("publishedAt") ?? "");

  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    imagePath: String(formData.get("imagePath") ?? "") || null,
    ageRangeLabel: String(formData.get("ageRangeLabel") ?? ""),
    sessionFormatLabel: String(formData.get("sessionFormatLabel") ?? ""),
    description: readJsonField<string[]>(formData, "description", []),
    highlights: readJsonField<{ title: string; description: string }[]>(formData, "highlights", []),
    publishedAt: publishedAt || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

async function handleMutation(promise: Promise<unknown>, slugsToRefresh: (string | undefined)[] = []): Promise<ResourceFormState> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? error.message, errors: error.body?.errors };
    }
    return { status: "error", message: "Beklenmeyen bir hata oluştu." };
  }
  updateTag("programs");
  for (const slug of new Set(slugsToRefresh.filter((slug): slug is string => Boolean(slug)))) {
    updateTag(`program:${slug}`);
  }
  return { status: "success", message: "Program başarıyla kaydedildi.", redirectUrl: "/admin/programlar" };
}

export async function createProgramAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminProgram }>("/api/admin/programs", "POST", buildProgramPayload(formData)));
}

export async function updateProgramAction(
  programId: number,
  previousSlug: string,
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const payload = buildProgramPayload(formData);
  return handleMutation(adminMutate<{ data: AdminProgram }>(`/api/admin/programs/${programId}`, "PUT", payload), [
    previousSlug,
    payload.slug as string,
  ]);
}

export async function deleteProgramAction(programId: number, slug: string): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/programs/${programId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("programs");
  updateTag(`program:${slug}`);
  return {};
}

/**
 * Sıfır JavaScript ile bir `<form action>` üzerinden çağrılır (bkz.
 * `ReorderButtons`/çöp kutusu "Geri Al" butonu) — bu yüzden geri dönüş
 * değeri kasıtlı olarak `void`dur: gösterilecek bir form/toast bağlamı
 * yoktur. Hata olursa yalnızca sunucu günlüğüne yazılır ve öğe listede
 * kalmaya devam eder.
 */
export async function restoreProgramAction(programId: number, slug: string): Promise<void> {
  try {
    await adminMutate(`/api/admin/programs/${programId}/restore`, "POST");
    updateTag("programs");
    updateTag(`program:${slug}`);
  } catch (error) {
    console.error("[admin] Program geri alınamadı:", error);
  }
}

export async function reorderProgramsAction(orderedIds: number[]): Promise<void> {
  try {
    await adminMutate("/api/admin/programs/reorder", "POST", { ids: orderedIds });
    updateTag("programs");
  } catch (error) {
    console.error("[admin] Program sıralaması kaydedilemedi:", error);
  }
}
