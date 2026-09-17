# Backend — Laravel API + Yönetim Paneli

`frontend/` (Next.js) uygulamasının içeriğini besleyen Laravel 13 uygulaması.
İki işi var:

1. **Herkese açık JSON API** (`/api/*`) — site içeriğini frontend'in Zod
   şemalarıyla birebir eşleşen bir sözleşmeyle servis eder.
2. **Yönetim paneli** (`/admin`, Filament 5) — merkez personelinin içeriği
   kendi başına güncelleyebilmesi için.

Sözleşmenin tanımı: `docs/architecture.md` ve `docs/backend-blueprint.md`.

## Gereksinimler

| Araç | Sürüm |
|---|---|
| PHP | 8.3+ (geliştirmede 8.4 kullanılıyor) |
| Composer | 2.x |
| Veritabanı | Geliştirmede SQLite (kurulum gerekmez), üretimde MySQL 8 |

## Kurulum

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# .env içinde doldurulması gerekenler:
#   ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD   — ilk yönetici hesabı
#   INQUIRY_RECIPIENT_EMAIL                 — talep bildirimlerinin gideceği adres
#   FRONTEND_REVALIDATE_URL / _SECRET       — ISR tazeleme (aşağıya bakın)

php artisan migrate --seed
php artisan storage:link      # yüklenen görsellerin servis edilmesi için
php artisan serve --port=8000
```

Panel: <http://127.0.0.1:8000/admin> — `.env`'deki yönetici bilgileriyle giriş.

Kuyruk işçisi ayrı bir terminalde çalışmalıdır; talep bildirim e-postaları ve
ISR tazeleme istekleri kuyruk üzerinden gider:

```bash
php artisan queue:work
```

> İşçi çalışmasa bile veri kaybı olmaz: talepler senkron olarak veritabanına
> yazılır, yalnızca e-posta ve önbellek tazeleme gecikir.

## Frontend'i bağlama

`frontend/.env.local`:

```
API_BASE_URL=http://127.0.0.1:8000
REVALIDATE_SECRET=<backend/.env içindeki FRONTEND_REVALIDATE_SECRET ile aynı>
```

`API_BASE_URL` tanımsızsa frontend `src/mocks/*` içindeki yer tutucu veriye
düşer ve backend'e hiç istek atmaz.

## ISR tazeleme

Panelden bir içerik kaydedildiğinde `FrontendCacheObserver` devreye girer ve
`DispatchFrontendRevalidation` işi Next.js'in `/api/revalidate` uç noktasına
ilgili önbellek etiketlerini gönderir. Bu olmadan değişiklikler `revalidate: 300`
süresi dolana kadar sitede görünmez.

Etiket adları iki tarafta da elle tutulur ve **birebir eşleşmek zorundadır**:

| Kaynak | Yer |
|---|---|
| Laravel | Modellerdeki `FRONTEND_COLLECTION_TAG` / `FRONTEND_RECORD_TAG_PREFIX` sabitleri |
| Next.js | `frontend/src/lib/repositories/*.ts` içindeki `tags` ve `src/app/api/revalidate/route.ts` beyaz listesi |

## Testler

```bash
php artisan test        # 38 test
vendor/bin/pint         # kod stili
```

En kritik test `ProgramEndpointTest::test_published_at_is_formatted_as_zulu_time_for_zod`:
frontend'in Zod şeması `+00:00` biçimli tarihleri reddettiği için tarihler her
zaman `...Z` (Zulu) olarak dönmelidir. Carbon'un varsayılan
`toIso8601String()` metoduna dönülürse bu test kırılır.

## Üretime alırken

- `.env`: `APP_ENV=production`, `APP_DEBUG=false`, MySQL bilgileri, gerçek SMTP.
- `php artisan migrate --force`
- `php artisan config:cache route:cache view:cache`
- Kuyruk işçisi için bir süpervizör (Supervisor / systemd).
- Yükleme boyutu sınırı: web sunucusunda `post_max_size` ve
  `upload_max_filesize` en fazla birkaç MB olmalıdır (panel zaten dosya başına
  2 MB sınırı uygular).

## Mimari notlar

- **Sanctum kurulu değil.** Frontend API'ye yalnızca Server Component'lerden,
  sunucudan sunucuya erişir; tarayıcı oturumu taşımaz. Panel klasik oturum
  kimlik doğrulaması kullanır. İleride bir veli/yönetici SPA'i eklenirse
  `php artisan install:api` ile Sanctum devreye alınır.
- **Panel erişimi** `User::canAccessPanel` ile `is_admin` bayrağına bağlıdır.
  Bu alan bilinçli olarak `$fillable` dışındadır — kütle atamayla yetki
  yükseltmesi mümkün değildir. Hesaplar seeder veya `php artisan tinker` ile
  açılır; kayıt (registration) uç noktası yoktur.
- **Kategori ve ikon alanları** `enum()` yerine `string` kolonda tutulur
  (SQLite ↔ MySQL uyumu); kısıtlama Eloquent cast'i, Form Request ve Filament
  formunda üç katmanda birden uygulanır.
- **KVKK:** talep kayıtlarında ham IP saklanmaz, yalnızca uygulama anahtarıyla
  tuzlanmış geri döndürülemez bir özet (`ip_hash`) tutulur. Veli görüşleri
  (`testimonials`) varsayılan olarak yayında değildir; yazılı onay alınmadan
  yayına alınmamalıdır.
