<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\InquiryStatus;
use App\Models\Inquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminInquiryTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    public function test_visitor_submitted_fields_cannot_be_edited_by_the_admin(): void
    {
        $this->actingAsAdmin();
        $inquiry = Inquiry::factory()->create(['parent_full_name' => 'Orijinal Ad']);

        $this->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => InquiryStatus::Iletisimde->value,
            'internalNote' => 'Aradık, tekrar arayacağız.',
        ])->assertOk();

        $inquiry->refresh();
        $this->assertSame('Orijinal Ad', $inquiry->parent_full_name);
        $this->assertSame(InquiryStatus::Iletisimde, $inquiry->status);
        $this->assertSame('Aradık, tekrar arayacağız.', $inquiry->internal_note);
    }

    public function test_handled_at_is_stamped_once_on_first_transition_out_of_new(): void
    {
        $this->actingAsAdmin();
        $inquiry = Inquiry::factory()->create(['status' => InquiryStatus::Yeni]);

        $this->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => InquiryStatus::Iletisimde->value,
        ])->assertOk();

        $firstHandledAt = $inquiry->refresh()->handled_at;
        $this->assertNotNull($firstHandledAt);

        $this->travel(1)->hour();

        $this->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => InquiryStatus::Tamamlandi->value,
            'internalNote' => 'not güncellendi',
        ])->assertOk();

        $this->assertEquals($firstHandledAt, $inquiry->refresh()->handled_at);
    }

    public function test_index_can_filter_by_status_and_search(): void
    {
        $this->actingAsAdmin();
        Inquiry::factory()->create(['status' => InquiryStatus::Yeni, 'parent_full_name' => 'Ayşe Yılmaz']);
        Inquiry::factory()->create(['status' => InquiryStatus::Tamamlandi, 'parent_full_name' => 'Mehmet Kaya']);

        $this->getJson('/api/admin/inquiries?status=yeni')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.parentFullName', 'Ayşe Yılmaz');

        $this->getJson('/api/admin/inquiries?search=Kaya')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.parentFullName', 'Mehmet Kaya');
    }

    public function test_inquiry_fields_never_leak_into_the_public_api(): void
    {
        Inquiry::factory()->create();

        // Talepler için herkese açık bir GET uç noktası hiç yoktur.
        $this->getJson('/api/inquiries')->assertStatus(405);
    }

    public function test_non_admin_cannot_view_inquiries(): void
    {
        $this->getJson('/api/admin/inquiries')->assertStatus(401);
    }
}
