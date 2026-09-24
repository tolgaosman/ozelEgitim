<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Support\PageContentBlueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminPageContentTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    public function test_public_endpoint_returns_blueprint_defaults_when_nothing_is_customized(): void
    {
        $response = $this->getJson('/api/page-contents')->assertOk();

        $this->assertSame(
            PageContentBlueprint::defaultFor('footer'),
            $response->json('data.footer'),
        );
    }

    public function test_every_blueprint_key_has_a_valid_default(): void
    {
        foreach (PageContentBlueprint::keys() as $key) {
            $rules = PageContentBlueprint::rulesFor($key);
            $default = PageContentBlueprint::defaultFor($key);

            $validator = Validator::make($default, $rules);

            $this->assertFalse(
                $validator->fails(),
                "Blueprint varsayılanı kendi kurallarını ihlal ediyor: {$key} — ".$validator->errors(),
            );
        }
    }

    public function test_admin_can_update_a_block_and_the_public_endpoint_reflects_it(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/page-contents/footer', ['tagline' => 'Yeni slogan metni'])
            ->assertOk()
            ->assertJsonPath('data.tagline', 'Yeni slogan metni');

        $this->getJson('/api/page-contents')
            ->assertJsonPath('data.footer.tagline', 'Yeni slogan metni');
    }

    public function test_unknown_key_returns_404(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/page-contents/does.not.exist', ['x' => 'y'])
            ->assertStatus(404);
    }

    public function test_unexpected_fields_are_rejected(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/page-contents/footer', [
            'tagline' => 'ok',
            'extraField' => 'nope',
        ])->assertStatus(422)->assertJsonValidationErrors(['extraField']);
    }

    public function test_deleting_a_block_resets_it_to_the_default(): void
    {
        $this->actingAsAdmin();

        $this->putJson('/api/admin/page-contents/footer', ['tagline' => 'Değiştirilmiş'])->assertOk();
        $this->deleteJson('/api/admin/page-contents/footer')->assertOk();

        $this->getJson('/api/page-contents')
            ->assertJsonPath('data.footer.tagline', PageContentBlueprint::defaultFor('footer')['tagline']);
    }

    public function test_non_admin_cannot_write_page_content(): void
    {
        $this->putJson('/api/admin/page-contents/footer', ['tagline' => 'x'])->assertStatus(401);
    }
}
