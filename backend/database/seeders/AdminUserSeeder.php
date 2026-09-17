<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Yönetici parolası koda gömülmez; `.env` içindeki ADMIN_SEED_PASSWORD
 * değerinden okunur. `is_admin` bayrağı `$fillable` dışında olduğu için
 * burada açıkça atanır — kütle atamayla yetki yükseltmesi mümkün değildir
 * (Rule 03).
 */
final class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = (string) env('ADMIN_SEED_EMAIL');
        $adminPassword = (string) env('ADMIN_SEED_PASSWORD');

        if (blank($adminEmail) || blank($adminPassword)) {
            throw new RuntimeException(
                'ADMIN_SEED_EMAIL ve ADMIN_SEED_PASSWORD .env içinde tanımlı olmalıdır.',
            );
        }

        $administrator = User::query()->firstOrNew(['email' => $adminEmail]);
        $administrator->name = (string) env('ADMIN_SEED_NAME', 'Merkez Yöneticisi');
        $administrator->password = $adminPassword;   // 'hashed' cast'i şifreler
        $administrator->email_verified_at = now();
        $administrator->is_admin = true;
        $administrator->save();
    }
}
