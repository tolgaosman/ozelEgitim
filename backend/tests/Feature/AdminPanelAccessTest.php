<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Panel erişimi tek bir kapıya bağlıdır: `User::canAccessPanel`. Bu testler
 * o kapının hem açık hem kapalı yönünü doğrular — yalnızca "giriş yapmış
 * olmak" yeterli değildir (Rule 03).
 */
final class AdminPanelAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_is_redirected_to_the_login_page(): void
    {
        $this->get('/admin')->assertRedirect();
    }

    public function test_the_login_page_is_publicly_reachable(): void
    {
        $this->get('/admin/login')->assertOk();
    }

    public function test_an_authenticated_user_without_the_admin_flag_is_denied(): void
    {
        $regularUser = User::factory()->create();
        $regularUser->is_admin = false;
        $regularUser->save();

        $this->assertFalse($regularUser->canAccessPanel(filament()->getPanel('admin')));
    }

    public function test_an_administrator_is_allowed(): void
    {
        $administrator = User::factory()->create();
        $administrator->is_admin = true;
        $administrator->save();

        $this->assertTrue($administrator->canAccessPanel(filament()->getPanel('admin')));
    }

    /**
     * `is_admin` `$fillable` dışındadır: kütle atamayla yetki yükseltmesi
     * (privilege escalation) mümkün olmamalıdır.
     */
    public function test_the_admin_flag_cannot_be_set_through_mass_assignment(): void
    {
        $createdUser = User::create([
            'name' => 'Sızma Denemesi',
            'email' => 'sizma@example.com',
            'password' => 'gizli-parola',
            'is_admin' => true,
        ]);

        $this->assertFalse($createdUser->fresh()->is_admin);
    }
}
