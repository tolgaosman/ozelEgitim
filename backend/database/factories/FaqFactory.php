<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\FaqCategory;
use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Faq> */
final class FaqFactory extends Factory
{
    protected $model = Faq::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'category' => $this->faker->randomElement(FaqCategory::cases()),
            'question' => $this->faker->unique()->sentence().'?',
            'answer' => $this->faker->paragraph(),
            'is_published' => true,
            'sort_order' => $this->faker->numberBetween(0, 50),
        ];
    }

    public function unpublished(): self
    {
        return $this->state(fn (): array => ['is_published' => false]);
    }
}
