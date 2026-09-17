<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Models\Concerns\NotifiesFrontendCache;
use Illuminate\Database\Eloquent\Model;

/**
 * Tek satırlık ayar kaydı (singleton). `current()` aynı istek içinde birden
 * çok kez çağrılsa bile veritabanına yalnızca bir sorgu gider.
 */
final class SiteSetting extends Model implements ProvidesFrontendCacheTags
{
    use NotifiesFrontendCache;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'site-settings';

    public const FRONTEND_RECORD_TAG_PREFIX = null;

    protected $fillable = [
        'phone_display',
        'phone_tel',
        'whatsapp_url',
        'email',
        'address',
        'maps_url',
        'instagram_url',
        'facebook_url',
        'youtube_url',
        'weekday_hours',
        'saturday_hours',
        'sunday_hours',
        'kvkk_body',
    ];

    private static ?self $memoizedRecord = null;

    protected function casts(): array
    {
        return [
            'kvkk_body' => 'array',
        ];
    }

    public static function current(): self
    {
        return self::$memoizedRecord ??= self::query()->firstOrFail();
    }

    /** Test ve seeder'lar arasında sızıntı olmaması için önbelleği boşaltır. */
    public static function forgetMemoizedRecord(): void
    {
        self::$memoizedRecord = null;
    }

    protected static function booted(): void
    {
        self::saved(static fn () => self::forgetMemoizedRecord());
    }
}
