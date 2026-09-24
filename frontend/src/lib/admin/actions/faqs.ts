"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminFaq } from "@/lib/admin/types";

function buildFaqPayload(formData: FormData): Record<string, unknown> {
  return {
    category: String(formData.get("category") ?? ""),
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
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
  updateTag("faqs");
  return { status: "success", message: "Soru başarıyla kaydedildi.", redirectUrl: "/admin/sss" };
}

export async function createFaqAction(_previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminFaq }>("/api/admin/faqs", "POST", buildFaqPayload(formData)));
}

export async function updateFaqAction(faqId: number, _previousState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  return handleMutation(adminMutate<{ data: AdminFaq }>(`/api/admin/faqs/${faqId}`, "PUT", buildFaqPayload(formData)));
}

export async function deleteFaqAction(faqId: number): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/faqs/${faqId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  updateTag("faqs");
  return {};
}

/** Sıfır JavaScript ile bir `<form action>` üzerinden çağrılır — bkz. `programs.ts`teki aynı desenin açıklaması. */
export async function restoreFaqAction(faqId: number): Promise<void> {
  try {
    await adminMutate(`/api/admin/faqs/${faqId}/restore`, "POST");
    updateTag("faqs");
  } catch (error) {
    console.error("[admin] Soru geri alınamadı:", error);
  }
}

export async function reorderFaqsAction(orderedIds: number[]): Promise<void> {
  try {
    await adminMutate("/api/admin/faqs/reorder", "POST", { ids: orderedIds });
    updateTag("faqs");
  } catch (error) {
    console.error("[admin] Soru sıralaması kaydedilemedi:", error);
  }
}
