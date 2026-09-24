<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Requests\Admin\SiteStatRequest;
use App\Http\Resources\SiteStatResource;
use App\Models\SiteStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class SiteStatController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $stats = SiteStat::query()->orderBy('sort_order')->get();

        return SiteStatResource::collection($stats);
    }

    public function store(SiteStatRequest $request): SiteStatResource
    {
        $stat = SiteStat::create($request->toDatabaseAttributes());

        return SiteStatResource::make($stat);
    }

    public function update(SiteStatRequest $request, SiteStat $siteStat): SiteStatResource
    {
        $siteStat->update($request->toDatabaseAttributes());

        return SiteStatResource::make($siteStat);
    }

    public function destroy(SiteStat $siteStat): JsonResponse
    {
        $siteStat->delete();

        return response()->json(['message' => 'Sayaç silindi.']);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        SiteStat::query()->whereKey($orderedIds)->get()->each(
            fn (SiteStat $siteStat) => $siteStat->update(['sort_order' => array_search($siteStat->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}
