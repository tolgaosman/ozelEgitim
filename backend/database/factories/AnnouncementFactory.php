<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AnnouncementCategory;
use App\Models\Announcement;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Announcement> */
final class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(4);

        return [
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'title' => $title,
            'excerpt' => $this->faker->sentence(),
            'body' => [$this->faker->paragraph(), $this->faker->paragraph()],
            'image_path' => null,
            'category' => $this->faker->randomElement(AnnouncementCategory::cases()),
            'sort_order' => 0,
            'published_at' => now()->subDay(),
        ];
    }

    public function draft(): self
    {
        return $this->state(fn (): array => ['published_at' => null]);
    }
}
