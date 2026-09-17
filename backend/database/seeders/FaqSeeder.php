<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

final class FaqSeeder extends Seeder
{
    public function run(): void
    {
        foreach (SeedData::load('faqs') as $faqRecord) {
            Faq::query()->updateOrCreate(
                ['question' => $faqRecord['question']],
                [
                    'category' => $faqRecord['category'],
                    'answer' => $faqRecord['answer'],
                    'is_published' => true,
                    'sort_order' => $faqRecord['sortOrder'],
                ],
            );
        }
    }
}
