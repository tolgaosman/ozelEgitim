# Mimari — Frontend ↔ Laravel Backend Sözleşmesi

Bu belge, `frontend/` (Next.js) ile `backend/` (Laravel) arasındaki entegrasyon
sözleşmesini tanımlar. Backend uygulanmıştır; bu sözleşme korunduğu sürece
sayfa bileşenlerinde değişiklik gerekmez.

## 1. Veri akışı

```
Server Component (app/**/page.tsx)
        │
        ▼
lib/repositories/*.ts   — API_BASE_URL tanımlıysa Laravel'e istek atar,
        │                  tanımlı değilse src/mocks/* döner.
        │                  İstek başarısız olursa da mock'a düşer
        │                  (lib/repositories/with-fallback.ts).
        ▼
lib/api/http.ts         — fetch + timeout + Zod doğrulama (fetchJson)
        │
        ▼
Laravel API Resource yanıtı → { data: T } veya { data: T[], meta: {...} }
```

Tüm veri çekme işlemleri **Server Component** içinde `fetch` ile yapılır
(`next: { revalidate, tags }` ile ISR).

**Hata politikası:** `API_BASE_URL` tanımlıyken backend erişilemezse
`resolveWithFallback` devreye girer, hatayı loglar ve yer tutucu veriye düşer —
site ayakta kalır. Tek istisna **404**: bu bir kesinti değil, backend'in kesin
cevabıdır ("kayıt yok"), bu yüzden `resolveRecordWithFallback` doğrudan `null`
döner ve sayfa `not-found` durumuna geçer. Aksi halde panelden silinmiş bir
program sitede yer tutucudan yaşamaya devam ederdi.

## 2. Ortam değişkenleri

| Değişken | Konum | Açıklama |
|---|---|---|
| `API_BASE_URL` | frontend `.env.local` | Laravel API'nin taban URL'i. Tanımlı değilse repository katmanı mock veriye düşer. `next.config.ts` uzak görsel host'unu da bundan türetir. |
| `REVALIDATE_SECRET` | frontend `.env.local` | Laravel'den gelen ISR tazeleme isteklerini doğrular. |
| `FRONTEND_REVALIDATE_URL` | backend `.env` | Next.js'in `/api/revalidate` uç noktası. |
| `FRONTEND_REVALIDATE_SECRET` | backend `.env` | `REVALIDATE_SECRET` ile **birebir aynı** olmalıdır. |
| `INQUIRY_RECIPIENT_EMAIL` | backend `.env` | Ön görüşme talebi bildirimlerinin gideceği adres. |
| `ADMIN_SEED_NAME` / `ADMIN_SEED_PASSWORD` | backend `.env` | Seeder'ın açtığı ilk yönetici hesabının adı ve şifresi. E-posta ayrı tutulmaz — her zaman `SiteSetting.email` (işletme e-postası) ile aynıdır. |

`NEXT_PUBLIC_` öneki kullanılmaz çünkü istemci tarafında doğrudan API'ye istek
atılmaz — tüm veri Server Component'ler üzerinden akar. Bu, API taban URL'inin
ve API anahtarlarının tarayıcıya hiç sızmaması anlamına gelir.

## 3. Kimlik doğrulama

Sitedeki tüm içerik herkese açıktır; içerik uç noktaları kimlik doğrulaması
gerektirmez.

Yönetim paneli artık Filament değil, sitenin kendi `/admin` adresinde çalışan
bir Next.js bölümüdür (bkz. `frontend/src/app/admin/`). Kimlik doğrulama
Laravel Sanctum kişisel erişim token'larıyla yapılır:

1. Next.js sunucusu `POST /api/admin/login`'e yalnızca `{password}` gönderir
   (`app/Http/Controllers/Api/Admin/AdminAuthController`) — giriş ekranında
   e-posta alanı yoktur, hesap her zaman `SiteSetting.email` (sitede gösterilen
   işletme e-postası) ile eşleşen, `is_admin=true` kullanıcıdır.
2. Başarılı girişte `admin` yeteneğine sahip, 7 gün geçerli bir Sanctum
   token'ı döner. Next.js bu token'ı tarayıcıya hiç göndermeden `iz_admin_token`
   adlı `HttpOnly`, `SameSite=Strict` bir çerezde saklar
   (`frontend/src/lib/admin/actions/auth.ts`).
3. `/admin/*` altındaki her istek `src/proxy.ts` ile hızlı bir ön kontrolden
   (çerez var mı) geçer; gerçek doğrulama `app/admin/(protected)/layout.tsx`
   içinde `GET /api/admin/me` ile yapılır — token geçersizse `/admin/giris`'e
   yönlendirilir.
4. Tüm `/api/admin/*` uç noktaları `auth:sanctum` + `ability:admin`
   middleware'leriyle korunur (`routes/api.php`). `is_admin` kütle atama
   dışındadır (`User` modelindeki `#[Fillable(...)]` özniteliği), bu yüzden
   yalnızca seeder veya konsol üzerinden açıkça atanabilir.
5. İşletme e-postası panelden (Ayarlar) değiştirilirse yönetici hesabının
   e-postası otomatik senkronize edilir (`Admin\SiteSettingController::update`)
   — aksi halde giriş kuralı ile ayarlardaki e-posta birbirinden sapardı.

İleride bir **veli paneli** (Next.js tarafında oturum açılan ayrı bir alan)
eklenirse, tarayıcıdan doğrudan çerezli oturum gerektiği için Sanctum'un SPA
akışı (`/sanctum/csrf-cookie`, `X-XSRF-TOKEN`) kullanılır; yönetim paneli
bunun aksine yalnızca sunucudan sunucuya bearer token kullanır.

## 4. Uç nokta sözleşmesi

| Uç Nokta | Yöntem | Zod Şeması | Frontend Repository |
|---|---|---|---|
| `/api/programs` | GET | `ProgramSchema` (koleksiyon) | `fetchProgramCollection` |
| `/api/programs/{slug}` | GET | `ProgramSchema` (tekil) | `fetchProgramBySlug` |
| `/api/announcements` | GET | `AnnouncementSchema` (koleksiyon) | `fetchAnnouncementCollection` |
| `/api/announcements/{slug}` | GET | `AnnouncementSchema` (tekil) | `fetchAnnouncementBySlug` |
| `/api/staff-members` | GET | `StaffMemberSchema` (koleksiyon) | `fetchStaffCollection` |
| `/api/faqs` | GET | `FaqSchema` (koleksiyon) | `fetchFaqCollection` |
| `/api/testimonials` | GET | `TestimonialSchema` (koleksiyon) | `fetchTestimonialCollection` |
| `/api/site-settings` | GET | `SiteSettingsSchema` (tekil) | `fetchSiteSettings` |
| `/api/inquiries` | POST | `InquirySchema` | `src/app/iletisim/actions.ts` |

Tüm şemalar `frontend/src/lib/schemas/*.ts` içinde tanımlıdır ve TypeScript
tipleri bu şemalardan `z.infer` ile türetilir — backend yanıtı şemadan saparsa
`ApiError` fırlatılır (bkz. `frontend/src/lib/api/http.ts`).

### Sözleşmenin iki kritik kuralı

1. **Tarihler Zulu biçiminde döner** (`2026-01-15T09:00:00.000Z`). Zod v4'ün
   `z.iso.datetime()` doğrulayıcısı sayısal UTC farkını (`+00:00`) reddeder,
   bu yüzden Carbon'un `toIso8601String()` metodu kullanılamaz. Biçimlendirme
   `App\Support\IsoDate::formatIsoZulu()` üzerinden yapılır.
2. **İsteğe bağlı alanlar `null` değil, hiç gönderilmez.** Zod'da
   `z.string().optional()` `null` kabul etmez. Görsel/fotoğraf alanları için
   `App\Support\MediaUrl::resolveOrMissing()`, sosyal medya bağlantıları için
   `array_filter` bu işi yapar.

## 5. Önbellek tazeleme (ISR)

Panelden içerik kaydedildiğinde:

```
Admin API controller bir modeli kaydeder/siler
   → FrontendCacheObserver (saved / deleted / restored)
   → DispatchFrontendRevalidation (kuyruk)
   → POST {FRONTEND_REVALIDATE_URL}  { "tags": [...] }
      header: X-Revalidate-Secret
   → frontend/src/app/api/revalidate/route.ts
   → revalidateTag(tag, "max")
```

Etiket adları iki tarafta da elle tutulur ve birebir eşleşmek zorundadır:

| Etiket | Laravel sabiti | Frontend |
|---|---|---|
| `programs`, `program:{slug}` | `Program::FRONTEND_*` | `repositories/programs.ts` |
| `announcements`, `announcement:{slug}` | `Announcement::FRONTEND_*` | `repositories/announcements.ts` |
| `staff-members` | `StaffMember::FRONTEND_*` | `repositories/staff.ts` |
| `faqs` | `Faq::FRONTEND_*` | `repositories/faqs.ts` |
| `testimonials` | `Testimonial::FRONTEND_*` | `repositories/testimonials.ts` |
| `site-settings` | `SiteSetting::FRONTEND_*`, `SiteStat::FRONTEND_*` | `repositories/site-settings.ts` |

Route handler, gizli anahtarı sabit zamanlı karşılaştırır ve etiketleri beyaz
listeye göre süzer — tanınmayan bir etiketle önbelleğin tamamı boşaltılamaz.

`revalidateTag`'in ikinci argümanı Next.js 16'da zorunludur. `"max"` seçildiği
için tazelemeden sonraki **ilk** istek bayat içeriği alır ve arka planda
yenilemeyi tetikler; sonraki istek güncel içeriği görür. Ziyaretçi hiç
bekletilmez.

## 6. Görseller

Panelden yüklenen görseller Laravel'in `storage` diskinde tutulur ve
`/storage/...` altından servis edilir. `next.config.ts`, `API_BASE_URL`'den
türettiği host'u `images.remotePatterns` listesine ekler.

Program ve kadro görselleri isteğe bağlıdır. Yüklenmemişse:

- program → `frontend/src/lib/program-images.ts` içindeki slug→dosya eşlemesi,
  o da yoksa genel yer tutucu;
- kadro → ad-soyaddan üretilen baş harf avatarı.
