<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementRequest;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Resources\Admin\AdminAnnouncementResource;
use App\Models\Announcement;
use App\Support\MediaCleanup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class AnnouncementController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $announcements = Announcement::query()
            ->withTrashed()
            ->orderByDesc('published_at')
            ->orderBy('sort_order')
            ->get();

        return AdminAnnouncementResource::collection($announcements);
    }

    public function store(AnnouncementRequest $request): AdminAnnouncementResource
    {
        $announcement = Announcement::create($request->toDatabaseAttributes());

        return AdminAnnouncementResource::make($announcement);
    }

    public function show(Announcement $announcement): AdminAnnouncementResource
    {
        return AdminAnnouncementResource::make($announcement);
    }

    public function update(AnnouncementRequest $request, Announcement $announcement): AdminAnnouncementResource
    {
        $previousImagePath = $announcement->image_path;

        $announcement->update($request->toDatabaseAttributes());

        if ($announcement->image_path !== $previousImagePath) {
            MediaCleanup::deleteIfOwned($previousImagePath);
        }

        return AdminAnnouncementResource::make($announcement);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();

        return response()->json(['message' => 'Duyuru çöp kutusuna taşındı.']);
    }

    public function restore(int $id): AdminAnnouncementResource
    {
        $announcement = Announcement::withTrashed()->findOrFail($id);
        $announcement->restore();

        return AdminAnnouncementResource::make($announcement);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        Announcement::query()->whereKey($orderedIds)->get()->each(
            fn (Announcement $announcement) => $announcement->update(['sort_order' => array_search($announcement->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}
