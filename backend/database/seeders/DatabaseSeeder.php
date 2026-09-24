<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // AdminUserSeeder önce site ayarlarına bakar (işletme e-postasıyla
            // eşleşen hesabı oluşturur), bu yüzden SiteSettingSeeder'dan SONRA
            // çalışmalıdır.
            SiteSettingSeeder::class,
            AdminUserSeeder::class,
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
