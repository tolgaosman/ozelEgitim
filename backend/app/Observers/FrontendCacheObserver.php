<?php

declare(strict_types=1);

namespace App\Observers;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Jobs\DispatchFrontendRevalidation;
use Illuminate\Database\Eloquent\Model;

/**
 * Tek bir gözlemci tüm içerik modellerine bağlanır; her model tazelenecek
 * etiketleri kendisi bildirir (bkz. ProvidesFrontendCacheTags). Böylece her
 * model için ayrı gözlemci yazmak gerekmez.
 *
 * `saved` hem oluşturma hem güncellemeyi kapsar. Slug değiştiğinde ESKİ
 * slug'ın etiketi de tazelenmelidir, aksi halde eski adres önbellekte
 * silinmiş içerikle asılı kalır.
 */
final class FrontendCacheObserver
{
    public function saved(Model&ProvidesFrontendCacheTags $model): void
    {
        $cacheTags = $model->frontendCacheTags();

        $originalSlug = $model->getOriginal('slug');
        if (filled($originalSlug) && $originalSlug !== $model->getAttribute('slug')) {
            $previousRecordTag = $model->frontendCacheTagForSlug((string) $originalSlug);

            if ($previousRecordTag !== null) {
                $cacheTags[] = $previousRecordTag;
            }
        }

        DispatchFrontendRevalidation::dispatch(array_values(array_unique($cacheTags)));
    }

    public function deleted(Model&ProvidesFrontendCacheTags $model): void
    {
        DispatchFrontendRevalidation::dispatch($model->frontendCacheTags());
    }

    public function restored(Model&ProvidesFrontendCacheTags $model): void
    {
        DispatchFrontendRevalidation::dispatch($model->frontendCacheTags());
    }

    public function forceDeleted(Model&ProvidesFrontendCacheTags $model): void
    {
        DispatchFrontendRevalidation::dispatch($model->frontendCacheTags());
    }
}
