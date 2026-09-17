<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ProgramIcon;
use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Program> */
final class ProgramFactory extends Factory
{
    protected $model = Program::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        $name = $this->faker->unique()->sentence(3);

        return [
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'name' => $name,
            'short_description' => $this->faker->sentence(),
            'description' => [$this->faker->paragraph(), $this->faker->paragraph()],
            'icon' => $this->faker->randomElement(ProgramIcon::cases()),
            'age_range_label' => '6-14 yaş',
            'session_format_label' => 'Bire bir, haftada 2 seans',
            'highlights' => [
                ['title' => $this->faker->sentence(3), 'description' => $this->faker->sentence()],
            ],
            'image_path' => null,
            'sort_order' => $this->faker->numberBetween(0, 50),
            'published_at' => now()->subDay(),
        ];
    }

    /** Henüz yayına alınmamış taslak program. */
    public function draft(): self
    {
        return $this->state(fn (): array => ['published_at' => null]);
    }

    /** Yayın tarihi gelecekte olan, zamanlanmış program. */
    public function scheduled(): self
    {
        return $this->state(fn (): array => ['published_at' => now()->addWeek()]);
    }
}
