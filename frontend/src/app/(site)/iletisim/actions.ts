"use server";

import { InquirySchema, type InquiryFormState, type InquiryInput } from "@/lib/schemas/inquiry";
import { resolveClientIp } from "@/lib/request-ip";

/**
 * İletişim formunu Laravel `POST /api/inquiries` uç noktasına iletir.
 *
 * İstek Server Action içinden, sunucudan sunucuya yapılır: API taban adresi
 * ve gelecekte eklenecek anahtarlar tarayıcıya hiç sızmaz (bkz.
 * docs/architecture.md §2). Hız sınırlaması backend'de `throttle:6,1` ile
 * uygulanır; burada tekrarlanmaz.
 */

const API_BASE_URL = process.env.API_BASE_URL;

const REQUEST_TIMEOUT_MS = 8000;

const SUCCESS_MESSAGE =
  "Talebiniz alındı. Ekibimiz bir hafta içinde sizinle iletişime geçecektir.";

/** Laravel'in 422 yanıtındaki alan hataları sözlüğü. */
type LaravelValidationErrorBody = {
  errors?: Record<string, string[]>;
};

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
  // botlara formun engellendiğini belli etmemek için (Rule 03). Backend de
  // aynı davranışı bağımsız olarak uygular.
  if (parsedResult.data.honeypot) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  // Backend henüz yapılandırılmamışsa form yine de doğrulanır ama veri
  // hiçbir yere gitmez; veliye yanlış bir onay vermemek için bunu açıkça
  // söylüyoruz.
  if (!API_BASE_URL) {
    console.error("[api] API_BASE_URL tanımlı değil — ön görüşme talebi kaydedilemedi.");
    return {
      status: "error",
      message:
        "Talebiniz şu anda iletilemedi. Lütfen telefon veya WhatsApp üzerinden bizimle iletişime geçin.",
    };
  }

  // Bal küpü alanı kasıtlı olarak gönderilmez: saklanacak bir veri değil.
  const inquiryPayload = {
    parentFullName: parsedResult.data.parentFullName,
    childAgeLabel: parsedResult.data.childAgeLabel,
    phoneNumber: parsedResult.data.phoneNumber,
    email: parsedResult.data.email,
    programOfInterest: parsedResult.data.programOfInterest,
    message: parsedResult.data.message,
  };

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);
  const clientIp = await resolveClientIp();

  try {
    const httpResponse = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify(inquiryPayload),
      cache: "no-store",
    });

    if (httpResponse.ok) {
      return { status: "success", message: SUCCESS_MESSAGE };
    }

    if (httpResponse.status === 422) {
      return buildValidationFailureState(await httpResponse.json().catch(() => null));
    }

    if (httpResponse.status === 429) {
      return {
        status: "error",
        message: "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.",
      };
    }

    console.error(`[api] Ön görüşme talebi iletilemedi: HTTP ${httpResponse.status}`);
    return {
      status: "error",
      message:
        "Talebiniz şu anda iletilemedi. Lütfen telefon veya WhatsApp üzerinden bizimle iletişime geçin.",
    };
  } catch (failureReason) {
    console.error(`[api] Ön görüşme talebi iletilemedi: ${String(failureReason)}`);
    return {
      status: "error",
      message:
        "Bağlantı kurulamadı. Lütfen telefon veya WhatsApp üzerinden bizimle iletişime geçin.",
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
}

/**
 * Backend'in alan hatalarını formun kendi hata sözlüğüne çevirir. Alan adları
 * her iki tarafta da camelCase olduğu için ek bir eşleme gerekmez.
 */
function buildValidationFailureState(responseBody: unknown): InquiryFormState {
  const fieldErrors: Partial<Record<keyof InquiryInput, string>> = {};
  const backendErrors = (responseBody as LaravelValidationErrorBody | null)?.errors;

  if (backendErrors) {
    for (const [fieldName, messages] of Object.entries(backendErrors)) {
      const firstMessage = messages[0];
      if (firstMessage) {
        fieldErrors[fieldName as keyof InquiryInput] = firstMessage;
      }
    }
  }

  return {
    status: "error",
    message: "Formda düzeltilmesi gereken alanlar var.",
    fieldErrors,
  };
}
