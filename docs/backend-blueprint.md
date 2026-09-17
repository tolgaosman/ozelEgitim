# Backend Şeması — Laravel

`backend/` altındaki Laravel uygulamasının veri modeli ve katman yapısı.
Frontend'in beklediği sözleşme için bkz. `docs/architecture.md`.
Kurulum ve çalıştırma için bkz. `backend/README.md`.

## 1. Veritabanı şeması

Kategori ve ikon alanları bilinçli olarak `enum()` yerine `string` kolonda
tutulur — SQLite (geliştirme) ile MySQL (üretim) arasında şema kayması
olmasın diye. Kısıtlama Eloquent cast'i, Form Request ve Filament formunda
üç katmanda birden uygulanır.

```
programs
  id                bigint PK
  slug              string unique
  name              string
  short_description string
  description       json            -- string[] paragraf listesi
  icon              string          -- App\Enums\ProgramIcon
  age_range_label   string
  session_format_label string
  highlights        json            -- [{title, description}], 1-6 öğe
  image_path        string nullable -- storage/public altındaki yol
  sort_order        unsignedInteger default 0
  published_at      timestamp nullable
  deleted_at        timestamp nullable   -- SoftDeletes
  timestamps

announcements
  id            bigint PK
  slug          string unique
  title         string
  excerpt       string
  body          json            -- string[] paragraf listesi
  image_path    string nullable
  category      string          -- App\Enums\AnnouncementCategory
  sort_order    unsignedInteger default 0
  published_at  timestamp nullable
  deleted_at    timestamp nullable
  timestamps

staff_members
  id           bigint PK
  slug         string unique
  full_name    string
  title        string
  specialties  json            -- string[], 1-5 öğe
  bio          text
  photo_path   string nullable
  sort_order   unsignedInteger default 0
  deleted_at   timestamp nullable
  timestamps

faqs
  id            bigint PK
  category      string          -- App\Enums\FaqCategory
  question      string
  answer        text
  is_published  boolean default true
  sort_order    unsignedInteger default 0
  deleted_at    timestamp nullable
  timestamps

testimonials
  id                bigint PK
  parent_name       string      -- KVKK gereği "Bir Veli" gibi kısaltılmış olmalı
  relation_label    string
  quote             text
  program_id        bigint nullable FK -> programs.id (nullOnDelete)
  is_published      boolean default false  -- yayına almadan önce yazılı onay şartı
  sort_order        unsignedInteger default 0
  timestamps

inquiries
  id                    bigint PK
  parent_full_name      string
  child_age_label       string
  phone_number          string
  email                 string
  program_of_interest   string nullable
  message               text nullable
  status                string default 'yeni'   -- App\Enums\InquiryStatus
  internal_note         text nullable           -- yalnızca ekip görür
  ip_hash               string(64) nullable     -- HMAC-SHA256, ham IP saklanmaz
  handled_at            timestamp nullable
  timestamps

site_settings                    -- tek satır (singleton)
  id, phone_display, phone_tel, whatsapp_url, email, address, maps_url,
  instagram_url nullable, facebook_url nullable, youtube_url nullable,
  weekday_hours, saturday_hours, sunday_hours,
  kvkk_body json                 -- string[] paragraf listesi
  timestamps

site_stats                       -- anasayfa/hakkımızda sayaç kartları
  id, target_value unsignedInteger, suffix string(8), label string,
  sort_order unsignedInteger default 0, timestamps

users
  ... Laravel varsayılanı + is_admin boolean default false
```

## 2. Eloquent modelleri

Ortak desen: açık `$fillable` (asla `$guarded`), `casts()` içinde json→array
ve enum sınıfı cast'leri, gerektiğinde `scopePublished()`.

```php
final class Program extends Model implements ProvidesFrontendCacheTags
{
    use HasFactory, NotifiesFrontendCache, SoftDeletes;

    public const FRONTEND_COLLECTION_TAG = 'programs';
    public const FRONTEND_RECORD_TAG_PREFIX = 'program';

    protected $fillable = [ /* açık liste — Rule 03 */ ];

    protected function casts(): array
    {
        return [
            'description' => 'array',
            'highlights' => 'array',
            'icon' => ProgramIcon::class,
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
```

`NotifiesFrontendCache` trait'i, iki sabitten yola çıkarak modelin hangi ISR
etiketlerini tazeleyeceğini üretir (bkz. `docs/architecture.md` §5).

`User` modelinde `is_admin` **bilinçli olarak `$fillable` dışındadır** —
kütle atamayla yetki yükseltmesi mümkün olmasın diye yalnızca açık atamayla
verilir.

## 3. API Resource (JSON zarfı)

Alan adları `camelCase` döner — frontend'deki Zod şemalarıyla birebir eşleşir,
araya bir dönüştürme katmanı gerekmez.

```php
final class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'icon' => $this->icon->value,
            'ageRangeLabel' => $this->age_range_label,
            'sessionFormatLabel' => $this->session_format_label,
            'highlights' => $this->highlights,
            'image' => MediaUrl::resolveOrMissing($this->image_path),
            'sortOrder' => $this->sort_order,
            'publishedAt' => IsoDate::formatIsoZulu($this->published_at),
        ];
    }
}
```

İki yardımcı, sözleşmenin en kolay bozulan iki noktasını kapatır:

- **`IsoDate::formatIsoZulu()`** — `2026-01-15T09:00:00.000Z` üretir. Carbon'un
  `toIso8601String()` metodu `+00:00` üretir ve Zod v4 bunu **reddeder**.
  `ProgramEndpointTest` bu biçimi düzenli ifadeyle doğrular.
- **`MediaUrl::resolveOrMissing()`** — görsel yoksa `MissingValue` döner,
  böylece alan yanıttan tamamen çıkar. `null` göndermek Zod'un `optional`
  alanından düşerdi.

`Testimonial` veritabanında `program_id` tutar ama frontend slug bekler;
ilişki controller'da `with('program:id,slug')` ile önden yüklenir (N+1 önlemi,
`ContentEndpointTest` bunu sorgu sayısıyla doğrular).

## 4. Controller'lar

```php
final class ProgramController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $publishedPrograms = Program::query()->published()->orderBy('sort_order')->get();

        return ProgramResource::collection($publishedPrograms)
            ->additional(['meta' => ['total' => $publishedPrograms->count()]]);
    }

    public function show(string $slug): ProgramResource
    {
        return ProgramResource::make(
            Program::query()->published()->where('slug', $slug)->firstOrFail(),
        );
    }
}
```

Sıralama: programlar / kadro / SSS `sort_order`, duyurular `published_at desc`.

## 5. Form Request ve talep akışı

`StoreInquiryRequest` kuralları frontend'deki `InquirySchema` ile birebir
aynıdır. İki tarafta da doğrulama yapılması kasıtlıdır: Zod kullanıcıya anında
geri bildirim verir, Form Request API'ye doğrudan gelen istekleri savunur.

```php
'parentFullName' => ['required', 'string', 'min:2', 'max:120'],
'childAgeLabel'  => ['required', 'string', 'max:30'],
'phoneNumber'    => ['required', 'string', 'regex:/^[0-9+()\s-]{10,20}$/u'],
'email'          => ['required', 'email:rfc', 'max:160'],
'programOfInterest' => ['nullable', 'string', 'max:120'],
'message'        => ['nullable', 'string', 'max:1000'],
'honeypot'       => ['nullable', 'string', 'max:255'],
```

**Bal küpü (`honeypot`) bilerek doğrulama hatası üretmez.** `max:0` kuralı 422
döndürür ve bota formun engellendiğini öğretirdi; bunun yerine alan yalnızca
yük boyutu için sınırlanır ve `InquiryController` dolu geldiğinde kaydı
oluşturmadan başarılı bir yanıt döner — gerçek gönderimden ayırt edilemez.

`InquiryController::store` her zaman `$request->validated()` kullanır, asla
`$request->all()` (Rule 03). `status` ve `internal_note` gibi takip alanları
`$fillable` içinde olsa da herkese açık uç noktadan yazılamaz; testler bunu
doğrular.

Ham IP saklanmaz: `hash_hmac('sha256', $ip, config('app.key'))` ile geri
döndürülemez bir özet tutulur (KVKK veri minimizasyonu).

```php
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:6,1');
```

Talep kaydedildikten sonra `InquiryReceivedMail` (ShouldQueue) merkeze
bildirim gönderir. Kuyruk işçisi çalışmasa bile talep veritabanına yazılmıştır.

## 6. Yönetim paneli

Filament 5, `/admin` yolunda, klasik oturum kimlik doğrulaması ile.
Gezinme grupları: **İçerik** (Programlar, Duyurular, Kadro, SSS, Veli
Görüşleri), **Talepler**, **Site Ayarları** (İletişim ve Genel, Sayaç
Kartları).

- Talepler yalnızca siteden oluşur; panelde `create` sayfası yoktur ve velinin
  gönderdiği alanlar salt okunurdur. Yalnızca durum ve iç not yazılabilir.
- Site Ayarları tek satırlık bir tablo olduğu için liste/düzenle yerine tek bir
  singleton sayfası (`ManageSiteSettings`) sunar.
- Form kısıtları Zod sınırlarını yansıtır (ör. `highlights` en fazla 6 madde) —
  panelden geçersiz veri girilemez, dolayısıyla `ApiError` kaynağında önlenir.
- Yükleme güvenliği: yalnızca jpeg/png/webp, dosya başına 2 MB, `public` diske.

## 7. Testler

`php artisan test` — 38 test, `tests/Feature/` altında:

| Dosya | Kapsam |
|---|---|
| `Api/ProgramEndpointTest` | Şema yapısı, Zulu tarih biçimi, `highlights` nesne yapısı, görsel alanının atlanması, taslak/zamanlanmış/silinmiş kayıtların gizlenmesi, sıralama, 404 |
| `Api/ContentEndpointTest` | Duyuru/kadro/SSS/görüş şemaları ve yayın filtreleri, `programSlug` çevrimi, N+1 kontrolü, site ayarları |
| `Api/InquiryEndpointTest` | Kayıt + mail kuyruğu, ip_hash, alan hataları, kütle atama savunması, bal küpü, hız sınırı |
| `AdminPanelAccessTest` | Misafir yönlendirmesi, `is_admin` kapısı, yetki yükseltme savunması |
| `FrontendRevalidationTest` | Etiketlerin doğru üretilmesi, slug değişiminde eski adresin de tazelenmesi, yapılandırma yokken sessiz geçiş |
