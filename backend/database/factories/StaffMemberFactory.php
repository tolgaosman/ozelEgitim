<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\StaffMember;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<StaffMember> */
final class StaffMemberFactory extends Factory
{
    protected $model = StaffMember::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        $fullName = $this->faker->unique()->name();

        return [
            'slug' => Str::slug($fullName).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'full_name' => $fullName,
            'title' => 'Özel Eğitim Uzmanı',
            'specialties' => [$this->faker->word(), $this->faker->word()],
            'bio' => $this->faker->paragraph(),
            'photo_path' => null,
            'sort_order' => $this->faker->numberBetween(0, 50),
        ];
    }
}
