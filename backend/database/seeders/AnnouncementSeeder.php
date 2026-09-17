<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

final class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        foreach (SeedData::load('announcements') as $sortIndex => $announcementRecord) {
            Announcement::query()->updateOrCreate(
                ['slug' => $announcementRecord['slug']],
                [
                    'title' => $announcementRecord['title'],
                    'excerpt' => $announcementRecord['excerpt'],
                    'body' => $announcementRecord['body'],
                    'image_path' => null,
                    'category' => $announcementRecord['category'],
                    'sort_order' => $sortIndex,
                    'published_at' => $announcementRecord['publishedAt'],
                ],
            );
        }
    }
}
