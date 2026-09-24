"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminStaffMember } from "@/lib/admin/types";

function readJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function buildStaffPayload(formData: FormData): Record<string, unknown> {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    photoPath: String(formData.get("photoPath") ?? "") || null,
    bio: String(formData.get("bio") ?? ""),
    specialties: readJsonField<string[]>(formData, "specialties", []),
    education: readJsonField<string[]>(formData, "education", []),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

async function handleMutation(promise: Promise<unknown>): Promise<ResourceFormState> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? error.message, errors: error.body?.errors };
    }
    return { status: "error", message: "Beklenmeyen bir hata oluştu." };
  }
  updateTag("staff-members");
  return { status: "success", message: "Kadro üyesi başarıyla kaydedildi.", redirectUrl: "/admin/kadro" };
}

export async function createStaffMemberAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminStaffMember }>("/api/admin/staff-members", "POST", buildStaffPayload(formData)));
}

export async function updateStaffMemberAction(
  staffMemberId: number,
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  return handleMutation(
    adminMutate<{ data: AdminStaffMember }>(`/api/admin/staff-members/${staffMemberId}`, "PUT", buildStaffPayload(formData)),
  );
}

export async function deleteStaffMemberAction(staffMemberId: number): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/staff-members/${staffMemberId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("staff-members");
  return {};
}

/** Sıfır JavaScript ile bir `<form action>` üzerinden çağrılır — bkz. `programs.ts`teki aynı desenin açıklaması. */
export async function restoreStaffMemberAction(staffMemberId: number): Promise<void> {
  try {
    await adminMutate(`/api/admin/staff-members/${staffMemberId}/restore`, "POST");
    updateTag("staff-members");
  } catch (error) {
    console.error("[admin] Kadro üyesi geri alınamadı:", error);
  }
}

export async function reorderStaffMembersAction(orderedIds: number[]): Promise<void> {
  try {
    await adminMutate("/api/admin/staff-members/reorder", "POST", { ids: orderedIds });
    updateTag("staff-members");
  } catch (error) {
    console.error("[admin] Kadro sıralaması kaydedilemedi:", error);
  }
}
