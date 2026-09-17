<?php

declare(strict_types=1);

namespace App\Models\Concerns;

/**
 * `ProvidesFrontendCacheTags` arayüzünün ortak uygulaması. Modeli kullanan
 * sınıf iki sabit tanımlar:
 *
 *   FRONTEND_COLLECTION_TAG — koleksiyon etiketi, ör. 'programs'
 *   FRONTEND_RECORD_TAG_PREFIX — tekil kayıt öneki, ör. 'program' (yoksa null)
 *
 * Değerler `frontend/src/lib/repositories/*.ts` içindeki `tags` dizileriyle
 * birebir eşleşmelidir.
 */
trait NotifiesFrontendCache
{
    /** @return list<string> */
    public function frontendCacheTags(): array
    {
        $cacheTags = [static::FRONTEND_COLLECTION_TAG];

        $currentSlug = $this->getAttribute('slug');
        if (filled($currentSlug)) {
            $recordTag = $this->frontendCacheTagForSlug((string) $currentSlug);

            if ($recordTag !== null) {
                $cacheTags[] = $recordTag;
            }
        }

        return $cacheTags;
    }

    public function frontendCacheTagForSlug(string $slug): ?string
    {
        $recordTagPrefix = static::FRONTEND_RECORD_TAG_PREFIX;

        return $recordTagPrefix === null ? null : "{$recordTagPrefix}:{$slug}";
    }
}
