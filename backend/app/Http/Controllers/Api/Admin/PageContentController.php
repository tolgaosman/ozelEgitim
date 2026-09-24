<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageContentRequest;
use App\Models\PageContent;
use App\Support\MediaCleanup;
use App\Support\PageContentBlueprint;
use Illuminate\Http\JsonResponse;

final class PageContentController extends Controller
{
    /** Tüm bloklar — DB'de kayıtlı olanlar override, diğerleri blueprint varsayılanı. */
    public function index(): JsonResponse
    {
        $overrides = PageContent::query()->pluck('content', 'key')->all();
        $blocks = array_replace(PageContentBlueprint::defaults(), $overrides);
        $blocks = PageContentBlueprint::resolveImageUrls($blocks);

        return response()->json([
            'data' => $blocks,
            'meta' => [
                // Panelde "varsayılana dön" seçeneği göstermek için hangi
                // blokların hiç düzenlenmediğini bilmek gerekir.
                'customizedKeys' => array_keys($overrides),
            ],
        ]);
    }

    public function update(PageContentRequest $request, string $key): JsonResponse
    {
        $previousContent = PageContent::query()->where('key', $key)->first()?->content;

        $pageContent = PageContent::query()->updateOrCreate(
            ['key' => $key],
            ['content' => $request->validated()],
        );

        $this->cleanupReplacedImages($key, $previousContent ?? PageContentBlueprint::defaultFor($key) ?? [], $pageContent->content);

        return response()->json(['data' => PageContentBlueprint::resolveImageUrls([$key => $pageContent->content])[$key]]);
    }

    /** Bloğu blueprint varsayılanına döndürür (DB satırını siler). */
    public function destroy(string $key): JsonResponse
    {
        if (! PageContentBlueprint::exists($key)) {
            return response()->json(['message' => 'Bilinmeyen içerik anahtarı.'], 404);
        }

        $previousContent = PageContent::query()->where('key', $key)->first()?->content;

        // Tek tek `delete()` çağrılır (toplu sorgu değil): Eloquent olayları
        // yalnızca model örneği üzerinden silindiğinde tetiklenir ve
        // FrontendCacheObserver bu olaya bağlıdır (bkz. AppServiceProvider).
        PageContent::query()->where('key', $key)->get()->each->delete();

        $defaultContent = PageContentBlueprint::defaultFor($key) ?? [];

        if ($previousContent !== null) {
            $this->cleanupReplacedImages($key, $previousContent, $defaultContent);
        }

        return response()->json(['data' => $defaultContent]);
    }

    /**
     * Bir blok kaydedilirken veya varsayılana döndürülürken artık
     * referanslanmayan, panelin kendi yüklediği görselleri diskten siler.
     *
     * @param  array<string, mixed>  $previousContent
     * @param  array<string, mixed>  $newContent
     */
    private function cleanupReplacedImages(string $key, array $previousContent, array $newContent): void
    {
        $imageField = PageContentBlueprint::imageFields()[$key] ?? null;
        if ($imageField !== null) {
            $previousValue = $previousContent[$imageField] ?? null;
            $newValue = $newContent[$imageField] ?? null;
            if (is_string($previousValue) && $previousValue !== $newValue) {
                MediaCleanup::deleteIfOwned($previousValue);
            }
        }

        $imageListField = PageContentBlueprint::imageListFields()[$key] ?? null;
        if ($imageListField !== null) {
            $previousValues = array_values(array_filter((array) ($previousContent[$imageListField] ?? []), 'is_string'));
            $newValues = array_values(array_filter((array) ($newContent[$imageListField] ?? []), 'is_string'));
            MediaCleanup::deleteRemoved($previousValues, $newValues);
        }
    }
}
