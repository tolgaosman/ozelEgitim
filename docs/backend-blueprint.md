# Backend Blueprint — Laravel (henüz uygulanmadı)

Bu belge, `backend/` klasörü altında yazılacak Laravel uygulaması için bir
plandır — kod değildir. Frontend'in beklediği sözleşme için bkz.
`docs/architecture.md`.

## 1. Veritabanı şeması

```
programs
  id                bigint PK
  slug              string unique
  name              string
  short_description string
  description       json            -- string[] paragraf listesi
  icon              string          -- ProgramIconSchema enum değerlerinden biri
  age_range_label   string
  session_format_label string
  highlights        json            -- string[], 1-6 öğe
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
  category      enum(etkinlik, duyuru, basari-hikayesi)
  published_at  timestamp
  deleted_at    timestamp nullable
  timestamps

staff_members
  id           bigint PK
  slug         string unique
  full_name    string
  title        string
  specialties  json            -- string[], 1-5 öğe
  bio          text
  sort_order   unsignedInteger default 0
  deleted_at   timestamp nullable
  timestamps

faqs
  id          bigint PK
  category    enum(kayit, programlar, gunluk-yasam, mali-destek)
  question    string
  answer      text
  sort_order  unsignedInteger default 0
  timestamps

testimonials
  id                bigint PK
  parent_name       string      -- KVKK gereği gerçek isim yerine "Bir Veli" gibi kısaltılmış olabilir
  relation_label    string
  quote             text
  program_id        bigint nullable FK -> programs.id
  is_published      boolean default false  -- yayına almadan önce yazılı onay şartı
  timestamps

inquiries
  id                    bigint PK
  parent_full_name      string
  child_age_label       string
  phone_number          string
  email                 string
  program_of_interest   string nullable
  message               text nullable
  status                enum(yeni, iletisimde, tamamlandi) default 'yeni'
  timestamps
```

## 2. Eloquent modelleri (özet)

```php
final class Program extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug', 'name', 'short_description', 'description', 'icon',
        'age_range_label', 'session_format_label', 'highlights', 'sort_order',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'description' => 'array',
            'highlights' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}

enum ProgramIcon: string
{
    case Puzzle = 'puzzle';
    case MessageCircle = 'message-circle';
    case Brain = 'brain';
    case Activity = 'activity';
    case Sprout = 'sprout';
    case Ear = 'ear';
    case HandHeart = 'hand-heart';
    case Users = 'users';
}
```

`Announcement`, `StaffMember`, `Faq`, `Testimonial` modelleri aynı desende
(fillable + casts + gerekirse scope) yazılır. `$guarded` yerine her zaman
açık `$fillable` listesi kullanılır (Rule 03: mass assignment kontrolü).

## 3. API Resource (JSON zarfı)

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
            'icon' => $this->icon,
            'ageRangeLabel' => $this->age_range_label,
            'sessionFormatLabel' => $this->session_format_label,
            'highlights' => $this->highlights,
            'sortOrder' => $this->sort_order,
            'publishedAt' => $this->published_at?->toIso8601String(),
        ];
    }
}
```

Alan adları kasıtlı olarak `camelCase` döner — frontend'deki
`ProgramSchema` (Zod) ile birebir eşleşir, ayrıca bir dönüştürme katmanına
gerek kalmaz.

## 4. Örnek Controller — `ProgramController.php`

```php
final class ProgramController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $programs = Program::query()
            ->published()
            ->orderBy('sort_order')
            ->get();

        return ProgramResource::collection($programs);
    }

    public function show(string $slug): ProgramResource
    {
        $program = Program::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return ProgramResource::make($program);
    }
}
```

`routes/api.php`:

```php
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{slug}', [ProgramController::class, 'show']);
```

## 5. Form Request örneği — `StoreInquiryRequest.php`

```php
final class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // herkese açık ön görüşme formu
    }

    public function rules(): array
    {
        return [
            'parentFullName' => ['required', 'string', 'min:2', 'max:120'],
            'childAgeLabel' => ['required', 'string', 'max:30'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9+()\s-]{10,20}$/u'],
            'email' => ['required', 'email', 'max:160'],
            'programOfInterest' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
```

`InquiryController::store` bu Form Request'i tip ipucu olarak alır,
`$request->validated()` ile doğrulanmış veriyi `Inquiry::create()`'e
geçirir — asla `$request->all()` kullanılmaz (Rule 03).

`routes/api.php` içinde bu uç nokta `throttle:6,1` middleware'i ile
korunur:

```php
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:6,1');
```

## 6. Kimlik doğrulama

Bu aşamada herkese açık bir kurumsal site olduğu için genel içerik
uç noktaları (`programs`, `announcements`, vb.) kimlik doğrulaması
gerektirmez. İleride bir yönetim paneli eklenirse Laravel Sanctum SPA
kimlik doğrulaması kullanılır (bkz. `docs/architecture.md` §3) ve tüm
yönetim uç noktaları `auth:sanctum` middleware'i ile korunur.
