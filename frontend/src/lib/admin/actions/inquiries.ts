"use server";

import { revalidatePath } from "next/cache";
import { AdminApiError, adminMutate } from "@/lib/admin/client";
import type { ResourceFormState } from "@/lib/admin/form-state";
import type { AdminInquiry } from "@/lib/admin/types";

export async function updateInquiryAction(
  inquiryId: number,
  _previousState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const payload = {
    status: String(formData.get("status") ?? "yeni"),
    internalNote: String(formData.get("internalNote") ?? "") || null,
  };

  try {
    await adminMutate<{ data: AdminInquiry }>(`/api/admin/inquiries/${inquiryId}`, "PUT", payload);
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? error.message, errors: error.body?.errors };
    }
    return { status: "error", message: "Beklenmeyen bir hata oluştu." };
  }

  // Talep listesi ve panel özet sayacı (sidebar rozeti) bu sayfayı yeniden
  // doğrulamayla tazelenir — talepler `revalidateTag` ile tazelenen herkese
  // açık site içeriğinin bir parçası değildir.
  revalidatePath("/admin/talepler");
  revalidatePath("/admin");

  return { status: "success", message: "Talep durumu güncellendi." };
}

export async function deleteInquiryAction(inquiryId: number): Promise<{ error?: string }> {
  try {
    await adminMutate(`/api/admin/inquiries/${inquiryId}`, "DELETE");
  } catch (error) {
    return { error: error instanceof AdminApiError ? error.message : "Silinemedi." };
  }
  revalidatePath("/admin/talepler");
  revalidatePath("/admin");
  return {};
}
