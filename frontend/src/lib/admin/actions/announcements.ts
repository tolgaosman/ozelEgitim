"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminAnnouncement } from "@/lib/admin/types";

function readJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function buildAnnouncementPayload(formData: FormData): Record<string, unknown> {
  const publishedAt = String(formData.get("publishedAt") ?? "");

  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? ""),
    imagePath: String(formData.get("imagePath") ?? "") || null,
    excerpt: String(formData.get("excerpt") ?? ""),
    body: readJsonField<string[]>(formData, "body", []),
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
  updateTag("announcements");
  for (const slug of new Set(slugsToRefresh.filter((slug): slug is string => Boolean(slug)))) {
    updateTag(`announcement:${slug}`);
  }
  return { status: "success", message: "Duyuru başarıyla kaydedildi.", redirectUrl: "/admin/duyurular" };
}

export async function createAnnouncementAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminAnnouncement }>("/api/admin/announcements", "POST", buildAnnouncementPayload(formData)));
}

export async function updateAnnouncementAction(
  announcementId: number,
  previousSlug: string,
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const payload = buildAnnouncementPayload(formData);
  return handleMutation(
    adminMutate<{ data: AdminAnnouncement }>(`/api/admin/announcements/${announcementId}`, "PUT", payload),
    [previousSlug, payload.slug as string],
  );
}

export async function deleteAnnouncementAction(announcementId: number, slug: string): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/announcements/${announcementId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("announcements");
  updateTag(`announcement:${slug}`);
  return {};
}

/** Sıfır JavaScript ile bir `<form action>` üzerinden çağrılır — bkz. `programs.ts`teki aynı desenin açıklaması. */
export async function restoreAnnouncementAction(announcementId: number, slug: string): Promise<void> {
  try {
    await adminMutate(`/api/admin/announcements/${announcementId}/restore`, "POST");
    updateTag("announcements");
    updateTag(`announcement:${slug}`);
  } catch (error) {
    console.error("[admin] Duyuru geri alınamadı:", error);
  }
}

export async function reorderAnnouncementsAction(orderedIds: number[]): Promise<void> {
  try {
    await adminMutate("/api/admin/announcements/reorder", "POST", { ids: orderedIds });
    updateTag("announcements");
  } catch (error) {
    console.error("[admin] Duyuru sıralaması kaydedilemedi:", error);
  }
}
