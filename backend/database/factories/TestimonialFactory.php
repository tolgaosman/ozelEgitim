<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Testimonial> */
final class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'parent_name' => 'Bir Veli',
            'relation_label' => '8 yaşındaki oğlunun annesi',
            'quote' => $this->faker->paragraph(),
            'program_id' => null,
            // Varsayılan olarak yayında DEĞİL — model varsayılanıyla aynı,
            // yazılı onay şartını testlerde de görünür kılar.
            'is_published' => false,
            'sort_order' => 0,
        ];
    }

    public function published(): self
    {
        return $this->state(fn (): array => ['is_published' => true]);
    }
}
