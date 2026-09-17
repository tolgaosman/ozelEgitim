<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SiteSettingSeeder::class,
            SiteStatSeeder::class,
            ProgramSeeder::class,
            AnnouncementSeeder::class,
            StaffMemberSeeder::class,
            FaqSeeder::class,
            // Görüşler programlara bağlandığı için ProgramSeeder'dan sonra.
            TestimonialSeeder::class,
        ]);
    }
}
