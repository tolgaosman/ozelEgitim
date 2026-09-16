import "server-only";
import { z } from "zod";

/**
 * Laravel backend'i devreye girene kadar bu taban URL tanımsız kalır ve
 * repository katmanı src/mocks içindeki veriye düşer. `NEXT_PUBLIC_` öneki
 * yalnızca istemci bileşenlerinin ihtiyaç duyduğu senaryolar için ayrılmıştır;
 * bu proje verisini yalnızca Server Component'lerden çektiği için sunucu
 * tarafı değişkeni yeterlidir.
 */
const API_BASE_URL = process.env.API_BASE_URL;

const DEFAULT_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isApiConfigured(): boolean {
  return Boolean(API_BASE_URL);
}

type FetchJsonOptions = {
  revalidateSeconds?: number;
  tags?: string[];
};

/**
 * Laravel API Resource yanıtlarını çeken, zaman aşımına uğrayan ve Zod
 * şemasıyla doğrulayan tipli sarmalayıcı. Şema doğrulaması başarısız olursa
 * (prototype pollution veya beklenmeyen backend değişikliği ihtimaline
 * karşı) `ApiError` fırlatılır; çağıran repository bunu mock veriye
 * düşerek karşılayabilir.
 */
export async function fetchJson<ResponseSchema extends z.ZodTypeAny>(
  path: string,
  schema: ResponseSchema,
  options: FetchJsonOptions = {},
): Promise<z.infer<ResponseSchema>> {
  if (!API_BASE_URL) {
    throw new ApiError("API_BASE_URL tanımlı değil.");
  }

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const httpResponse = await fetch(`${API_BASE_URL}${path}`, {
      signal: abortController.signal,
      headers: { Accept: "application/json" },
      next: {
        revalidate: options.revalidateSeconds ?? 300,
        tags: options.tags,
      },
    });

    if (!httpResponse.ok) {
      throw new ApiError(`API isteği başarısız oldu: ${path}`, httpResponse.status);
    }

    const rawPayload: unknown = await httpResponse.json();
    const parsedResult = schema.safeParse(rawPayload);

    if (!parsedResult.success) {
      throw new ApiError(`API yanıtı beklenen şemayla eşleşmedi: ${path}`);
    }

    return parsedResult.data;
  } finally {
    clearTimeout(timeoutHandle);
  }
}
