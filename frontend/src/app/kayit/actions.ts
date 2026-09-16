"use server";

import { InquirySchema, type InquiryFormState, type InquiryInput } from "@/lib/schemas/inquiry";

/**
 * TODO(backend): Laravel `/api/inquiries` uç noktası hazır olduğunda bu
 * fonksiyon, doğrulanmış veriyi Sanctum korumalı bir POST isteğiyle iletmeli
 * ve backend'in kendi throttle (`throttle:6,1`) ile hız sınırlamasına
 * güvenmelidir. Şimdilik yalnızca sunucu tarafı doğrulama yapılır; hiçbir
 * veri kalıcı olarak saklanmaz.
 */
export async function submitInquiryAction(
  _previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const parsedResult = InquirySchema.safeParse({
    parentFullName: formData.get("parentFullName"),
    childAgeLabel: formData.get("childAgeLabel"),
    phoneNumber: formData.get("phoneNumber"),
    email: formData.get("email"),
    programOfInterest: formData.get("programOfInterest") ?? "",
    message: formData.get("message") ?? "",
    honeypot: formData.get("honeypot") ?? "",
  });

  if (!parsedResult.success) {
    const fieldErrors: Partial<Record<keyof InquiryInput, string>> = {};
    for (const issue of parsedResult.error.issues) {
      const fieldName = issue.path[0];
      if (typeof fieldName === "string" && !(fieldName in fieldErrors)) {
        fieldErrors[fieldName as keyof InquiryInput] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Formda düzeltilmesi gereken alanlar var.",
      fieldErrors,
    };
  }

  // Honeypot doluysa isteği sessizce başarılıymış gibi sonlandırıyoruz —
  // botlara formun engellendiğini belli etmemek için (Rule 03).
  if (parsedResult.data.honeypot) {
    return {
      status: "success",
      message: "Talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
    };
  }

  return {
    status: "success",
    message: "Talebiniz alındı. Ekibimiz bir hafta içinde sizinle iletişime geçecektir.",
  };
}
