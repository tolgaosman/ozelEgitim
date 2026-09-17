<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\InquiryStatus;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Inquiry> */
final class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'parent_full_name' => $this->faker->name(),
            'child_age_label' => '7 yaş',
            'phone_number' => '+90 533 000 00 00',
            'email' => $this->faker->unique()->safeEmail(),
            'program_of_interest' => null,
            'message' => $this->faker->sentence(),
            'status' => InquiryStatus::Yeni,
            'internal_note' => null,
            'ip_hash' => null,
            'handled_at' => null,
        ];
    }
}
