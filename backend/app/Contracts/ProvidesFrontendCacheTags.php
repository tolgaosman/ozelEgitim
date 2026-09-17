<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Bu arayüzü uygulayan modeller, kaydedildiklerinde Next.js tarafında hangi
 * ISR önbellek etiketlerinin geçersiz kılınacağını kendileri bildirir.
 * Etiket adları `frontend/src/lib/repositories/*.ts` içindeki `tags`
 * değerleriyle birebir aynı olmak zorundadır — yanlış bir etiket sessizce
 * hiçbir şeyi tazelemez.
 */
interface ProvidesFrontendCacheTags
{
    /** @return list<string> */
    public function frontendCacheTags(): array;

    /**
     * Verilen slug'a karşılık gelen tekil kayıt etiketi (ör. `program:xyz`).
     * Slug'ı olmayan modellerde `null` döner — o modeller yalnızca koleksiyon
     * etiketiyle tazelenir.
     */
    public function frontendCacheTagForSlug(string $slug): ?string;
}
