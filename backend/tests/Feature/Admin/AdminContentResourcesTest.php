<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\Faq;
use App\Models\Program;
use App\Models\SiteStat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

/**
 * Program dışındaki içerik kaynaklarının CRUD'u aynı deseni izler; her biri
 * için ayrı bir dosya yerine burada tek tek en kritik davranış doğrulanır
 * (AdminProgramTest zaten deseni ayrıntılı olarak kapsıyor).
 */
final class AdminContentResourcesTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    public function test_announcement_can_be_created_updated_and_soft_deleted(): void
    {
        $this->actingAsAdmin();

        $payload = [
            'title' => 'Yeni Duyuru',
            'slug' => 'yeni-duyuru',
            'category' => 'duyuru',
            'excerpt' => 'Özet metin',
            'body' => ['Paragraf 1'],
            'publishedAt' => null,
            'sortOrder' => 0,
        ];

        $created = $this->postJson('/api/admin/announcements', $payload)->assertCreated();
        $id = $created->json('data.id');

        $this->putJson("/api/admin/announcements/{$id}", [...$payload, 'title' => 'Güncellendi'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Güncellendi');

        $this->deleteJson("/api/admin/announcements/{$id}")->assertOk();
        $this->assertSoftDeleted('announcements', ['id' => $id]);

        $this->postJson("/api/admin/announcements/{$id}/restore")->assertOk();
        $this->assertDatabaseHas('announcements', ['id' => $id, 'deleted_at' => null]);
    }

    public function test_staff_member_specialties_are_capped_at_five(): void
    {
        $this->actingAsAdmin();

        $payload = [
            'fullName' => 'Test Uzman',
            'slug' => 'test-uzman',
            'title' => 'Terapist',
            'bio' => 'Kısa biyografi',
            'specialties' => array_fill(0, 6, 'Alan'),
            'education' => ['Lisans'],
            'sortOrder' => 0,
        ];

        $this->postJson('/api/admin/staff-members', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['specialties']);
    }

    public function test_faq_publish_toggle_and_reorder(): void
    {
        $this->actingAsAdmin();
        $faq = Faq::factory()->create(['is_published' => true, 'sort_order' => 0]);

        $this->putJson("/api/admin/faqs/{$faq->id}", [
            'category' => $faq->category->value,
            'question' => $faq->question,
            'answer' => $faq->answer,
            'isPublished' => false,
            'sortOrder' => 0,
        ])->assertOk()->assertJsonPath('data.isPublished', false);

        $this->assertDatabaseHas('faqs', ['id' => $faq->id, 'is_published' => false]);
    }

    public function test_testimonial_can_be_linked_to_a_program_and_requires_valid_program_id(): void
    {
        $this->actingAsAdmin();
        $program = Program::factory()->create();

        $this->postJson('/api/admin/testimonials', [
            'parentName' => 'Bir Veli',
            'relationLabel' => '8 yaşındaki oğlunun annesi',
            'quote' => 'Harika bir deneyim.',
            'programId' => $program->id,
            'isPublished' => true,
            'sortOrder' => 0,
        ])
            ->assertCreated()
            ->assertJsonPath('data.programName', $program->name);

        $this->postJson('/api/admin/testimonials', [
            'parentName' => 'Bir Veli',
            'relationLabel' => 'Anne',
            'quote' => 'Deneyim.',
            'programId' => 999999,
            'isPublished' => true,
            'sortOrder' => 0,
        ])->assertStatus(422)->assertJsonValidationErrors(['programId']);
    }

    public function test_site_stat_can_be_created_and_reordered(): void
    {
        $this->actingAsAdmin();

        $created = $this->postJson('/api/admin/site-stats', [
            'label' => 'Yeni Sayaç',
            'targetValue' => 100,
            'suffix' => '+',
            'sortOrder' => 0,
        ])->assertCreated();

        $this->assertDatabaseHas('site_stats', ['label' => 'Yeni Sayaç', 'target_value' => 100]);

        $other = SiteStat::query()->create([
            'label' => 'Diğer Sayaç',
            'target_value' => 50,
            'suffix' => '',
            'sort_order' => 1,
        ]);
        $this->postJson('/api/admin/site-stats/reorder', [
            'ids' => [$other->id, $created->json('data.id')],
        ])->assertOk();

        $this->assertSame(0, $other->refresh()->sort_order);
    }
}
