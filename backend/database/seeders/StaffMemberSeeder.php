<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\StaffMember;
use Illuminate\Database\Seeder;

final class StaffMemberSeeder extends Seeder
{
    public function run(): void
    {
        foreach (SeedData::load('staff') as $staffRecord) {
            StaffMember::query()->updateOrCreate(
                ['slug' => $staffRecord['slug']],
                [
                    'full_name' => $staffRecord['fullName'],
                    'title' => $staffRecord['title'],
                    'specialties' => $staffRecord['specialties'],
                    'education' => $staffRecord['education'],
                    'bio' => $staffRecord['bio'],
                    'photo_path' => null,
                    'sort_order' => $staffRecord['sortOrder'],
                ],
            );
        }
    }
}
