<?php

declare(strict_types=1);

namespace Tests\Feature\Admin\Concerns;

use App\Models\SiteSetting;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * Panel girişi tek bir işletme hesabına bağlıdır: `SiteSetting.email` ile
 * eşleşen, `is_admin=true` bir kullanıcı. Testler bu ikiliyi birlikte
 * kurar — biri olmadan diğeri anlamsızdır.
 */
trait InteractsWithAdminAuth
{
    protected function createSiteSetting(array $overrides = []): SiteSetting
    {
        return SiteSetting::query()->create([
            'phone_display' => '+90 533 888 14 05',
            'phone_tel' => '+905338881405',
            'whatsapp_url' => 'https://wa.me/905338881405',
            'email' => 'izozelegitim@yahoo.com',
            'address' => 'Test Adres',
            'maps_url' => 'https://maps.example.com',
            'instagram_url' => null,
            'facebook_url' => null,
            'youtube_url' => null,
            'weekday_hours' => '08:30 – 17:30',
            'saturday_hours' => '08:30 – 12:30',
            'sunday_hours' => 'Kapalı',
            'kvkk_body' => ['Test KVKK paragrafı.'],
            ...$overrides,
        ]);
    }

    protected function createAdminUser(?string $email = null, string $password = 'izozelegitim2026'): User
    {
        $siteSetting = SiteSetting::query()->first() ?? $this->createSiteSetting(
            $email !== null ? ['email' => $email] : [],
        );

        // `is_admin` kasıtlı olarak `$fillable` dışındadır (Rule 03) — kütle
        // atamayla (`create([...])`) sessizce `false` kalır. Gerçek
        // `AdminUserSeeder` gibi burada da açık atama gerekir.
        $administrator = new User([
            'name' => 'Merkez Yöneticisi',
            'email' => $email ?? $siteSetting->email,
            'password' => $password,
        ]);
        $administrator->is_admin = true;
        $administrator->email_verified_at = now();
        $administrator->save();

        return $administrator;
    }

    /** Sanctum token akışını atlayarak doğrudan yetkilendirilmiş bir admin oturumu açar. */
    protected function actingAsAdmin(?User $adminUser = null): User
    {
        $adminUser ??= $this->createAdminUser();

        Sanctum::actingAs($adminUser, ['admin']);

        return $adminUser;
    }

    /**
     * `AuthManager` bir HTTP isteğinin sonucunda çözümlediği kullanıcıyı
     * ('sanctum' guard'ı `RequestGuard` kullanır) test boyunca ayakta kalan
     * uygulama kabında bellekte tutar. Aynı test metodunda bir token
     * silindikten/değiştirildikten SONRA yapılan bir isteğin bu değişikliği
     * görmesi için guard önbelleği elle temizlenmelidir — gerçek üretimde
     * her istek kendi kabını aldığı için bu adıma hiç gerek yoktur.
     */
    protected function forgetAuthGuards(): void
    {
        $this->app->make('auth')->forgetGuards();
    }
}
