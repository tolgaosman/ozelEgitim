<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Jobs\DispatchFrontendRevalidation;
use App\Models\Program;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminProgramTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    /** @return array<string, mixed> */
    private function validPayload(array $overrides = []): array
    {
        return [
            'name' => 'Yeni Program',
            'slug' => 'yeni-program',
            'shortDescription' => 'Kısa açıklama',
            'icon' => 'puzzle',
            'ageRangeLabel' => '6-10 yaş',
            'sessionFormatLabel' => 'Bire bir',
            'description' => ['İlk paragraf'],
            'highlights' => [['title' => 'Başlık', 'description' => 'Açıklama']],
            'publishedAt' => null,
            'sortOrder' => 0,
            ...$overrides,
        ];
    }

    public function test_index_includes_draft_and_soft_deleted_programs(): void
    {
        $this->actingAsAdmin();
        Program::factory()->draft()->create(['name' => 'Taslak Program']);
        $trashed = Program::factory()->create(['name' => 'Silinmiş Program']);
        $trashed->delete();

        $response = $this->getJson('/api/admin/programs')->assertOk();

        $names = collect($response->json('data'))->pluck('name');
        $this->assertTrue($names->contains('Taslak Program'));
        $this->assertTrue($names->contains('Silinmiş Program'));
    }

    public function test_a_program_can_be_created(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/api/admin/programs', $this->validPayload())
            ->assertCreated()
            ->assertJsonPath('data.slug', 'yeni-program');

        $this->assertDatabaseHas('programs', ['slug' => 'yeni-program']);
    }

    public function test_slug_must_be_unique(): void
    {
        $this->actingAsAdmin();
        Program::factory()->create(['slug' => 'mevcut-slug']);

        $this->postJson('/api/admin/programs', $this->validPayload(['slug' => 'mevcut-slug']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_highlights_cannot_exceed_six_items(): void
    {
        $this->actingAsAdmin();

        $tooMany = array_fill(0, 7, ['title' => 't', 'description' => 'd']);

        $this->postJson('/api/admin/programs', $this->validPayload(['highlights' => $tooMany]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['highlights']);
    }

    public function test_a_program_can_be_updated(): void
    {
        $this->actingAsAdmin();
        $program = Program::factory()->create();

        $this->putJson("/api/admin/programs/{$program->id}", $this->validPayload([
            'slug' => $program->slug,
            'name' => 'Güncellenmiş İsim',
        ]))
            ->assertOk()
            ->assertJsonPath('data.name', 'Güncellenmiş İsim');
    }

    public function test_destroy_soft_deletes_and_restore_brings_it_back(): void
    {
        $this->actingAsAdmin();
        $program = Program::factory()->create();

        $this->deleteJson("/api/admin/programs/{$program->id}")->assertOk();
        $this->assertSoftDeleted('programs', ['id' => $program->id]);

        $this->postJson("/api/admin/programs/{$program->id}/restore")->assertOk();
        $this->assertDatabaseHas('programs', ['id' => $program->id, 'deleted_at' => null]);
    }

    public function test_reorder_updates_sort_order_by_array_position(): void
    {
        $this->actingAsAdmin();
        $first = Program::factory()->create(['sort_order' => 0]);
        $second = Program::factory()->create(['sort_order' => 1]);

        $this->postJson('/api/admin/programs/reorder', ['ids' => [$second->id, $first->id]])
            ->assertOk();

        $this->assertSame(0, $second->refresh()->sort_order);
        $this->assertSame(1, $first->refresh()->sort_order);
    }

    public function test_a_trashed_program_can_be_viewed_and_updated(): void
    {
        $this->actingAsAdmin();
        $program = Program::factory()->create();
        $program->delete();

        $this->getJson("/api/admin/programs/{$program->id}")->assertOk();

        $this->putJson("/api/admin/programs/{$program->id}", $this->validPayload([
            'slug' => $program->slug,
            'name' => 'Çöpteyken Güncellenen',
        ]))
            ->assertOk()
            ->assertJsonPath('data.name', 'Çöpteyken Güncellenen');

        $this->assertSoftDeleted('programs', ['id' => $program->id]);
    }

    public function test_reorder_triggers_a_frontend_revalidation(): void
    {
        $this->actingAsAdmin();
        Queue::fake();
        $first = Program::factory()->create(['sort_order' => 0]);
        $second = Program::factory()->create(['sort_order' => 1]);

        $this->postJson('/api/admin/programs/reorder', ['ids' => [$second->id, $first->id]])
            ->assertOk();

        Queue::assertPushed(DispatchFrontendRevalidation::class);
    }

    public function test_saving_a_program_triggers_a_frontend_revalidation(): void
    {
        $this->actingAsAdmin();
        Queue::fake();

        $this->postJson('/api/admin/programs', $this->validPayload())->assertCreated();

        Queue::assertPushed(DispatchFrontendRevalidation::class);
    }

    public function test_non_admin_cannot_manage_programs(): void
    {
        $this->getJson('/api/admin/programs')->assertStatus(401);
        $this->postJson('/api/admin/programs', $this->validPayload())->assertStatus(401);
    }
}
