import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookie";

const API_BASE_URL = process.env.API_BASE_URL;

const REQUEST_TIMEOUT_MS = 8000;

/**
 * Laravel'in 422 yanıtındaki doğrulama hatası sözlüğü — form action'ları
 * bunu doğrudan `useActionState` hata state'ine eşler.
 */
export type AdminApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class AdminApiError extends Error {
  readonly status: number;

  readonly body: AdminApiErrorBody | null;

  constructor(message: string, status: number, body: AdminApiErrorBody | null = null) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.body = body;
  }
}

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL tanımlı değil — yönetim paneli backend olmadan çalışamaz.");
  }
  return API_BASE_URL;
}

async function readToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

type AdminRequestInit = Omit<RequestInit, "body"> & { json?: unknown };

/**
 * Ham `fetch` sarmalayıcısı — token'ı ekler, zaman aşımı uygular. Sunucu
 * bileşenlerinde (`GET`) 401 doğrudan girişe yönlendirir; Server Action'lar
 * (`POST`/`PUT`/`DELETE`) 401'i `AdminApiError` olarak fırlatır ki form
 * kullanıcıya "oturumunuz sona erdi" mesajını gösterebilsin.
 */
async function adminFetch(path: string, init: AdminRequestInit = {}, options: { redirectOn401?: boolean } = {}): Promise<Response> {
  const token = await readToken();

  if (!token) {
    if (options.redirectOn401 ?? true) {
      redirect("/admin/giris");
    }
    throw new AdminApiError("Oturum bulunamadı.", 401);
  }

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  const { json, headers, ...restInit } = init;

  try {
    const response = await fetch(`${requireApiBaseUrl()}${path}`, {
      ...restInit,
      signal: abortController.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });

    if (response.status === 401) {
      if (options.redirectOn401 ?? true) {
        redirect("/admin/giris");
      }
      throw new AdminApiError("Oturumunuz sona erdi, lütfen tekrar giriş yapın.", 401);
    }

    return response;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

/** Sunucu bileşenlerinde veri okumak için: hata durumunda girişe yönlendirir veya fırlatır. */
export async function adminGet<T>(path: string): Promise<T> {
  const response = await adminFetch(path, { method: "GET" });

  if (!response.ok) {
    throw new AdminApiError(`İstek başarısız oldu: ${path}`, response.status);
  }

  return (await response.json()) as T;
}

/**
 * Server Action'larda kullanılan mutasyon sarmalayıcısı. 401'de
 * yönlendirmez — action'ın kendi `AdminApiError` yakalayıp forma
 * "oturum sona erdi" mesajı dönmesine izin verir.
 */
export async function adminMutate<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  json?: unknown,
): Promise<T> {
  const response = await adminFetch(path, { method, json }, { redirectOn401: false });
  const rawBody = await response.text();
  const parsedBody = rawBody ? (JSON.parse(rawBody) as unknown) : null;

  if (!response.ok) {
    throw new AdminApiError(
      (parsedBody as AdminApiErrorBody | null)?.message ?? "İstek başarısız oldu.",
      response.status,
      parsedBody as AdminApiErrorBody | null,
    );
  }

  return parsedBody as T;
}

/** Görsel yükleme yalnızca multipart gönderir; JSON sarmalayıcısı kullanılmaz. */
export async function adminUploadMedia(formData: FormData): Promise<{ path: string; url: string }> {
  const token = await readToken();
  if (!token) {
    throw new AdminApiError("Oturum bulunamadı.", 401);
  }

  const response = await fetch(`${requireApiBaseUrl()}/api/admin/media`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const rawBody = await response.text();
  let parsedBody: ({ data?: { path: string; url: string } } & AdminApiErrorBody) | null = null;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    console.error("Admin API non-JSON response:", rawBody);
  }

  if (!response.ok || !parsedBody?.data) {
    throw new AdminApiError(parsedBody?.message ?? `Görsel yüklenemedi (HTTP ${response.status}).`, response.status, parsedBody ?? undefined);
  }

  return parsedBody.data;
}
