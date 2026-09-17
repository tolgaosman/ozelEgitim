<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class AnnouncementController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        // Frontend de kendi tarafında yayın tarihine göre sıralıyor; burada
        // aynı sırayı üretmek, sayfalama eklenirse davranışın değişmemesini
        // garanti eder.
        $publishedAnnouncements = Announcement::query()
            ->published()
            ->orderByDesc('published_at')
            ->get();

        return AnnouncementResource::collection($publishedAnnouncements)
            ->additional(['meta' => ['total' => $publishedAnnouncements->count()]]);
    }

    public function show(string $slug): AnnouncementResource
    {
        $announcement = Announcement::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return AnnouncementResource::make($announcement);
    }
}
