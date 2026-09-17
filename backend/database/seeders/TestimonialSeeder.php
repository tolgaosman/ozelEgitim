<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

final class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        // Slug→id eşlemesi tek sorguda hazırlanır; her görüş için ayrı arama
        // yapmak döngü içinde N sorgu üretirdi (Rule 01).
        $programIdsBySlug = Program::query()->pluck('id', 'slug');

        foreach (SeedData::load('testimonials') as $sortIndex => $testimonialRecord) {
            $relatedProgramSlug = $testimonialRecord['programSlug'] ?? null;

            Testimonial::query()->updateOrCreate(
                ['quote' => $testimonialRecord['quote']],
                [
                    'parent_name' => $testimonialRecord['parentName'],
                    'relation_label' => $testimonialRecord['relationLabel'],
                    'program_id' => $programIdsBySlug[$relatedProgramSlug] ?? null,
                    // Yer tutucu görüşler yayına açık gelir ki site ilk
                    // kurulumda eksiksiz görünsün. Gerçek veli görüşleri
                    // panele yazılı onay alındıktan sonra işaretlenmelidir.
                    'is_published' => true,
                    'sort_order' => $sortIndex,
                ],
            );
        }
    }
}
