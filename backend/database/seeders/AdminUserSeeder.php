<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Yönetim paneli girişi tek bir şifre alanına indirgenmiştir (bkz.
 * `App\Http\Controllers\Api\Admin\AdminAuthController`) — hesap her zaman
 * sitede gösterilen işletme e-postasına (`SiteSetting::current()->email`)
 * bağlıdır. Bu yüzden bu seeder SiteSettingSeeder'dan SONRA çalışmalıdır
 * (bkz. DatabaseSeeder).
 *
 * Parola koda gömülmez; `.env` içindeki ADMIN_SEED_PASSWORD değerinden
 * okunur.
 */
final class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminPassword = (string) env('ADMIN_SEED_PASSWORD');

        if (blank($adminPassword)) {
            throw new RuntimeException(
                'ADMIN_SEED_PASSWORD .env içinde tanımlı olmalıdır.',
            );
        }

        $businessEmail = SiteSetting::current()->email;

        $administrator = User::query()->firstOrNew(['email' => $businessEmail]);
        $administrator->name = (string) env('ADMIN_SEED_NAME', 'Merkez Yöneticisi');
        $administrator->password = $adminPassword;   // 'hashed' cast'i şifreler
        $administrator->email_verified_at = now();
        $administrator->is_admin = true;
        $administrator->save();
    }
}
