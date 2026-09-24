<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminSiteSettingTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    /** @return array<string, mixed> */
    private function validPayload(array $overrides = []): array
    {
        return [
            'phoneDisplay' => '+90 533 000 00 00',
            'phoneTel' => '+905330000000',
            'whatsappUrl' => 'https://wa.me/905330000000',
            'email' => 'izozelegitim@yahoo.com',
            'address' => 'Yeni adres',
            'mapsUrl' => 'https://maps.example.com',
            'instagramUrl' => null,
            'facebookUrl' => null,
            'youtubeUrl' => null,
            'weekdayHours' => '09:00 – 18:00',
            'saturdayHours' => '09:00 – 13:00',
            'sundayHours' => 'Kapalı',
            'kvkkBody' => ['Yeni KVKK paragrafı.'],
            ...$overrides,
        ];
    }

    public function test_admin_can_update_site_settings(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/site-settings', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('data.contact.address', 'Yeni adres');

        $this->assertDatabaseHas('site_settings', ['address' => 'Yeni adres']);
    }

    public function test_changing_the_business_email_syncs_the_admin_users_login_email(): void
    {
        $adminUser = $this->actingAsAdmin();
        $this->assertSame('izozelegitim@yahoo.com', $adminUser->email);

        $this->putJson('/api/admin/site-settings', $this->validPayload([
            'email' => 'yeni-isletme@ornek.com',
        ]))->assertOk();

        $this->assertSame('yeni-isletme@ornek.com', $adminUser->refresh()->email);

        // Yeni e-posta ile giriş artık çalışmalı.
        $this->postJson('/api/admin/login', ['password' => 'izozelegitim2026'])->assertOk();
    }

    public function test_invalid_urls_are_rejected(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/site-settings', $this->validPayload(['mapsUrl' => 'not-a-url']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['mapsUrl']);
    }
}
