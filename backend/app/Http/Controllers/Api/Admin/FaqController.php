<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Resources\Admin\AdminFaqResource;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class FaqController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $faqs = Faq::query()
            ->withTrashed()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return AdminFaqResource::collection($faqs);
    }

    public function store(FaqRequest $request): AdminFaqResource
    {
        $faq = Faq::create($request->toDatabaseAttributes());

        return AdminFaqResource::make($faq);
    }

    public function show(Faq $faq): AdminFaqResource
    {
        return AdminFaqResource::make($faq);
    }

    public function update(FaqRequest $request, Faq $faq): AdminFaqResource
    {
        $faq->update($request->toDatabaseAttributes());

        return AdminFaqResource::make($faq);
    }

    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();

        return response()->json(['message' => 'Soru çöp kutusuna taşındı.']);
    }

    public function restore(int $id): AdminFaqResource
    {
        $faq = Faq::withTrashed()->findOrFail($id);
        $faq->restore();

        return AdminFaqResource::make($faq);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        Faq::query()->whereKey($orderedIds)->get()->each(
            fn (Faq $faq) => $faq->update(['sort_order' => array_search($faq->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}
