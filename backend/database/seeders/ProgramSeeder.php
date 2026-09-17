<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

final class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        foreach (SeedData::load('programs') as $programRecord) {
            Program::query()->updateOrCreate(
                ['slug' => $programRecord['slug']],
                [
                    'name' => $programRecord['name'],
                    'short_description' => $programRecord['shortDescription'],
                    'description' => $programRecord['description'],
                    'icon' => $programRecord['icon'],
                    'age_range_label' => $programRecord['ageRangeLabel'],
                    'session_format_label' => $programRecord['sessionFormatLabel'],
                    'highlights' => $programRecord['highlights'],
                    // Görsel yolu bilinçli olarak boş: yükleme yapılana kadar
                    // frontend kendi /public/images yer tutucularını kullanır.
                    'image_path' => null,
                    'sort_order' => $programRecord['sortOrder'],
                    'published_at' => $programRecord['publishedAt'],
                ],
            );
        }
    }
}
