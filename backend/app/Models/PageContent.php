<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use Illuminate\Database\Eloquent\Model;

/**
 * Sitedeki sayfa metinlerinin (hero'lar, ana sayfa bölümleri, SEO
 * başlıkları vb.) tek satır-anahtar deposu. Bloğun şekli ve varsayılan
 * değeri `App\Support\PageContentBlueprint` içinde tanımlıdır; bu tabloda
 * yalnızca panelden EN AZ BİR KEZ düzenlenmiş bloklar satır olarak bulunur.
 */
final class PageContent extends Model implements ProvidesFrontendCacheTags
{
    /** frontend/src/lib/repositories/page-content.ts içindeki ISR etiketiyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'page-content';

    protected $fillable = [
        'key',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    /**
     * Tüm bloklar tek bir yanıtta döndüğü ve panelde her blok kendi başına
     * kaydedildiği için tekil kayıt etiketine gerek yok — tüm istekler
     * yalnızca koleksiyon etiketini tazeler.
     */
    public function frontendCacheTags(): array
    {
        return [self::FRONTEND_COLLECTION_TAG];
    }

    public function frontendCacheTagForSlug(string $slug): ?string
    {
        return null;
    }
}
