"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminTestimonial } from "@/lib/admin/types";

function buildTestimonialPayload(formData: FormData): Record<string, unknown> {
  const programId = String(formData.get("programId") ?? "");

  return {
    parentName: String(formData.get("parentName") ?? ""),
    relationLabel: String(formData.get("relationLabel") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    programId: programId && programId !== "none" ? Number(programId) : null,
    isPublished: formData.has("isPublished"),
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
  updateTag("testimonials");
  return { status: "success", message: "Yorum başarıyla kaydedildi.", redirectUrl: "/admin/veli-yorumlari" };
}

export async function createTestimonialAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminTestimonial }>("/api/admin/testimonials", "POST", buildTestimonialPayload(formData)));
}

export async function updateTestimonialAction(
  testimonialId: number,
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  return handleMutation(
    adminMutate<{ data: AdminTestimonial }>(`/api/admin/testimonials/${testimonialId}`, "PUT", buildTestimonialPayload(formData)),
  );
}

export async function deleteTestimonialAction(testimonialId: number): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/testimonials/${testimonialId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("testimonials");
  return {};
}

/** Sıfır JavaScript ile bir `<form action>` üzerinden çağrılır — bkz. `programs.ts`teki aynı desenin açıklaması. */
export async function reorderTestimonialsAction(orderedIds: number[]): Promise<void> {
  try {
    await adminMutate("/api/admin/testimonials/reorder", "POST", { ids: orderedIds });
    updateTag("testimonials");
  } catch (error) {
    console.error("[admin] Veli yorumu sıralaması kaydedilemedi:", error);
  }
}
