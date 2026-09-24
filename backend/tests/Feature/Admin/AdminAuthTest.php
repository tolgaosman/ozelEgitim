<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminAuthTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    public function test_correct_password_returns_a_scoped_token(): void
    {
        $this->createAdminUser(password: 'izozelegitim2026');

        $response = $this->postJson('/api/admin/login', ['password' => 'izozelegitim2026'])
            ->assertOk()
            ->assertJsonStructure(['data' => ['token', 'expiresAt']]);

        $token = $response->json('data.token');
        $this->assertNotEmpty($token);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'izozelegitim@yahoo.com');
    }

    public function test_wrong_password_is_rejected_without_revealing_account_state(): void
    {
        $this->createAdminUser(password: 'izozelegitim2026');

        $this->postJson('/api/admin/login', ['password' => 'yanlis-sifre'])
            ->assertStatus(422)
            ->assertJsonMissingPath('data.token');
    }

    public function test_login_is_rejected_even_when_no_admin_account_exists(): void
    {
        $this->createSiteSetting();

        $this->postJson('/api/admin/login', ['password' => 'herhangi-bir-sey'])
            ->assertStatus(422);
    }

    public function test_login_is_throttled_after_five_attempts_per_minute(): void
    {
        $this->createAdminUser(password: 'izozelegitim2026');

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson('/api/admin/login', ['password' => 'yanlis'])->assertStatus(422);
        }

        $this->postJson('/api/admin/login', ['password' => 'yanlis'])->assertStatus(429);
    }

    public function test_protected_routes_reject_requests_without_a_token(): void
    {
        $this->getJson('/api/admin/me')->assertStatus(401);
        $this->getJson('/api/admin/dashboard')->assertStatus(401);
    }

    public function test_a_token_without_the_admin_ability_is_rejected(): void
    {
        $adminUser = $this->createAdminUser();
        Sanctum::actingAs($adminUser, ['some-other-ability']);

        $this->getJson('/api/admin/me')->assertStatus(403);
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $this->createAdminUser(password: 'izozelegitim2026');
        $token = $this->postJson('/api/admin/login', ['password' => 'izozelegitim2026'])
            ->json('data.token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/logout')
            ->assertOk();

        $this->forgetAuthGuards();
        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/me')
            ->assertStatus(401);
    }

    public function test_password_can_be_updated_and_revokes_other_sessions(): void
    {
        $adminUser = $this->createAdminUser(password: 'izozelegitim2026');
        $currentToken = $adminUser->createToken('current', ['admin'])->plainTextToken;
        $otherToken = $adminUser->createToken('other-device', ['admin'])->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$currentToken}")
            ->putJson('/api/admin/password', [
                'currentPassword' => 'izozelegitim2026',
                'newPassword' => 'yeni-guclu-sifre-2026',
                'newPassword_confirmation' => 'yeni-guclu-sifre-2026',
            ])
            ->assertOk();

        $this->assertTrue(Hash::check('yeni-guclu-sifre-2026', $adminUser->refresh()->password));

        // Diğer oturum (token) iptal edilmiş olmalı.
        $this->forgetAuthGuards();
        $this->withHeader('Authorization', "Bearer {$otherToken}")
            ->getJson('/api/admin/me')
            ->assertStatus(401);
    }

    public function test_password_update_requires_the_correct_current_password(): void
    {
        $adminUser = $this->createAdminUser(password: 'izozelegitim2026');
        $this->actingAsAdmin($adminUser);

        $this->putJson('/api/admin/password', [
            'currentPassword' => 'yanlis',
            'newPassword' => 'yeni-guclu-sifre-2026',
            'newPassword_confirmation' => 'yeni-guclu-sifre-2026',
        ])->assertStatus(422);
    }
}
