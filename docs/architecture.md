# Mimari — Frontend ↔ Laravel Backend Sözleşmesi

Bu belge, `frontend/` (Next.js) ile ileride yazılacak `backend/` (Laravel)
arasındaki entegrasyon sözleşmesini tanımlar. Şu an yalnızca frontend
geliştirilmiştir; backend devreye girdiğinde bu belgedeki sözleşme
korunmalıdır ki sayfa bileşenlerinde hiçbir değişiklik gerekmesin.

## 1. Veri akışı

```
Server Component (app/**/page.tsx)
        │
        ▼
lib/repositories/*.ts   — API_BASE_URL tanımlıysa Laravel'e istek atar,
        │                  tanımlı değilse src/mocks/* döner.
        ▼
lib/api/http.ts         — fetch + timeout + Zod doğrulama (fetchJson)
        │
        ▼
Laravel API Resource yanıtı → { data: T } veya { data: T[], meta: {...} }
```

Tüm veri çekme işlemleri **Server Component** içinde `fetch` ile yapılır
(`next: { revalidate, tags }` ile ISR). Yalnızca istemci tarafı etkileşimli
kısımlar (ör. gelecekte eklenebilecek duyuru filtresi) SWR kullanır.

## 2. Ortam değişkenleri

| Değişken | Konum | Açıklama |
|---|---|---|
| `API_BASE_URL` | Sunucu (frontend `.env.local`) | Laravel API'nin taban URL'i, örn. `https://api.izozelegitim.com`. Tanımlı değilse repository katmanı mock veriye düşer. |

`NEXT_PUBLIC_` öneki kullanılmaz çünkü istemci tarafında doğrudan API'ye
istek atılmaz — tüm veri Server Component'ler üzerinden akar. Bu, API
taban URL'inin ve ileride eklenecek API anahtarlarının tarayıcıya hiç
sızmaması anlamına gelir.

## 3. Kimlik doğrulama — Laravel Sanctum (SPA modeli)

Bu proje şu an herhangi bir yetkilendirilmiş (authenticated) alan
içermiyor — tüm içerik herkese açık. İleride bir veli/yönetici paneli
eklenirse:

1. Next.js, Laravel'in `/sanctum/csrf-cookie` uç noktasına önce bir istek
   atarak `XSRF-TOKEN` çerezini alır.
2. Giriş isteği bu tokenı `X-XSRF-TOKEN` header'ında Laravel'e geri
   gönderir; Laravel oturum çerezini `HttpOnly`, `Secure`, `SameSite=Lax`
   (veya SPA farklı alt domainde ise `SameSite=None` + `Secure`) olarak
   döner.
3. Next.js tarafında oturum tokenı **asla** `localStorage` veya
   `sessionStorage`'da tutulmaz — yalnızca tarayıcının otomatik yönettiği
   `HttpOnly` çerez kullanılır (Rule 03).
4. Sonraki tüm mutasyon istekleri (`POST`/`PUT`/`DELETE`), Next.js Server
   Action'ları içinden `credentials: "include"` ile Laravel'e proxy'lenir;
   CSRF tokenı her istekte header'a eklenir.

## 4. Uç nokta sözleşmesi (özet)

| Uç Nokta | Yöntem | Zod Şeması | Frontend Repository |
|---|---|---|---|
| `/api/programs` | GET | `ProgramSchema` (koleksiyon) | `fetchProgramCollection` |
| `/api/programs/{slug}` | GET | `ProgramSchema` (tekil) | `fetchProgramBySlug` |
| `/api/announcements` | GET | `AnnouncementSchema` (koleksiyon) | `fetchAnnouncementCollection` |
| `/api/announcements/{slug}` | GET | `AnnouncementSchema` (tekil) | `fetchAnnouncementBySlug` |
| `/api/staff-members` | GET | `StaffMemberSchema` (koleksiyon) | `fetchStaffCollection` |
| `/api/faqs` | GET | `FaqSchema` (koleksiyon) | `fetchFaqCollection` |
| `/api/testimonials` | GET | `TestimonialSchema` (koleksiyon) | `fetchTestimonialCollection` |
| `/api/inquiries` | POST | `InquirySchema` | `app/kayit/actions.ts` (henüz backend'e bağlı değil) |

Tüm şemalar `frontend/src/lib/schemas/*.ts` içinde tanımlıdır ve TypeScript
tipleri bu şemalardan `z.infer` ile türetilir — backend yanıtı şemadan
saparsa `ApiError` fırlatılır (bkz. `frontend/src/lib/api/http.ts`).

## 5. Geçiş adımları (backend hazır olduğunda)

1. `frontend/.env.local` içine `API_BASE_URL` eklenir.
2. Repository fonksiyonları otomatik olarak Laravel'e istek atmaya başlar
   — sayfa bileşenlerinde herhangi bir değişiklik gerekmez.
3. `docs/backend-blueprint.md` içindeki şema ve `ProgramController`
   örneği referans alınarak diğer controller'lar (`AnnouncementController`,
   `StaffMemberController`, `FaqController`, `TestimonialController`,
   `InquiryController`) yazılır.
4. `app/kayit/actions.ts` içindeki `TODO(backend)` yorumu çözülerek form
   verisi gerçek `/api/inquiries` uç noktasına iletilir.
