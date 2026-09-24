"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookie";
import { adminMutate, AdminApiError } from "@/lib/admin/client";
import { resolveClientIp } from "@/lib/request-ip";

const API_BASE_URL = process.env.API_BASE_URL;
const REQUEST_TIMEOUT_MS = 8000;

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
};

const LoginResponseSchema = z.object({
  data: z.object({
    token: z.string().min(1),
    expiresAt: z.iso.datetime({ offset: true }).or(z.string()),
  }),
});

/**
 * Giriş ekranında yalnızca bir şifre alanı vardır — hesap her zaman sitede
 * gösterilen işletme e-postasına bağlıdır (bkz. backend
 * `AdminAuthController`). Token tarayıcı JS'ine hiç ulaşmaz: burada
 * `HttpOnly` bir çerezde saklanır.
 */
export async function loginAction(_previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { status: "error", message: "Şifre gerekli." };
  }

  if (!API_BASE_URL) {
    return { status: "error", message: "Sunucu yapılandırması eksik. Lütfen daha sonra tekrar deneyin." };
  }

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);
  const clientIp = await resolveClientIp();

  let httpResponse: Response;
  try {
    httpResponse = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      cache: "no-store",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify({ password }),
    });
  } catch {
    return { status: "error", message: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." };
  } finally {
    clearTimeout(timeoutHandle);
  }

  if (httpResponse.status === 429) {
    return { status: "error", message: "Çok fazla deneme yapıldı. Lütfen bir dakika sonra tekrar deneyin." };
  }

  if (httpResponse.status === 422) {
    return { status: "error", message: "Şifre hatalı." };
  }

  if (!httpResponse.ok) {
    return { status: "error", message: "Giriş yapılamadı. Lütfen tekrar deneyin." };
  }

  const parsed = LoginResponseSchema.safeParse(await httpResponse.json().catch(() => null));
  if (!parsed.success) {
    return { status: "error", message: "Sunucudan beklenmeyen bir yanıt geldi." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, parsed.data.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(parsed.data.data.expiresAt),
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  try {
    await adminMutate("/api/admin/logout", "POST");
  } catch {
    // Token zaten geçersizse çıkış yine de tamamlanır — çerez aşağıda silinir.
  }

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
  redirect("/admin/giris");
}

export type UpdatePasswordFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function updatePasswordAction(
  _previousState: UpdatePasswordFormState,
  formData: FormData,
): Promise<UpdatePasswordFormState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordConfirmation = String(formData.get("newPassword_confirmation") ?? "");

  if (newPassword.length < 8) {
    return { status: "error", message: "Yeni şifre en az 8 karakter olmalıdır." };
  }

  if (newPassword !== newPasswordConfirmation) {
    return { status: "error", message: "Yeni şifreler eşleşmiyor." };
  }

  try {
    await adminMutate("/api/admin/password", "PUT", {
      currentPassword,
      newPassword,
      newPassword_confirmation: newPasswordConfirmation,
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { status: "error", message: error.body?.message ?? "Şifre güncellenemedi." };
    }
    return { status: "error", message: "Şifre güncellenemedi." };
  }

  return { status: "success", message: "Şifreniz güncellendi." };
}
