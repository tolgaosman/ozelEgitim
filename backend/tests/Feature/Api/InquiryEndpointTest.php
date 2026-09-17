<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\InquiryStatus;
use App\Mail\InquiryReceivedMail;
use App\Models\Inquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

final class InquiryEndpointTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<string, string> */
    private function validInquiryPayload(array $overrides = []): array
    {
        return [
            'parentFullName' => 'Test Veli',
            'childAgeLabel' => '7 yaş',
            'phoneNumber' => '+90 533 000 00 00',
            'email' => 'veli@example.com',
            'programOfInterest' => 'dil-ve-konusma-terapisi',
            'message' => 'Ön görüşme talep ediyorum.',
            ...$overrides,
        ];
    }

    public function test_a_valid_inquiry_is_stored_and_notified(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', $this->validInquiryPayload())
            ->assertCreated();

        $this->assertDatabaseHas('inquiries', [
            'parent_full_name' => 'Test Veli',
            'email' => 'veli@example.com',
            'status' => InquiryStatus::Yeni->value,
        ]);

        Mail::assertQueued(InquiryReceivedMail::class);
    }

    public function test_the_raw_ip_address_is_never_stored(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', $this->validInquiryPayload())->assertCreated();

        $storedInquiry = Inquiry::query()->sole();

        $this->assertNotNull($storedInquiry->ip_hash);
        $this->assertSame(64, strlen($storedInquiry->ip_hash));
        $this->assertStringNotContainsString('127.0.0.1', $storedInquiry->ip_hash);
    }

    public function test_optional_empty_fields_are_stored_as_null(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', $this->validInquiryPayload([
            'programOfInterest' => '',
            'message' => '',
        ]))->assertCreated();

        $storedInquiry = Inquiry::query()->sole();

        $this->assertNull($storedInquiry->program_of_interest);
        $this->assertNull($storedInquiry->message);
    }

    public function test_invalid_input_returns_field_errors_the_form_can_display(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', [
            'parentFullName' => 'A',
            'childAgeLabel' => '',
            'phoneNumber' => 'gecersiz',
            'email' => 'gecersiz',
        ])
            ->assertStatus(422)
            // Alan adları camelCase döner — frontend'in InquiryInput
            // anahtarlarıyla birebir eşleşir, ek eşleme gerekmez.
            ->assertJsonValidationErrors(['parentFullName', 'childAgeLabel', 'phoneNumber', 'email']);

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_the_center_tracking_fields_cannot_be_set_by_the_visitor(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', $this->validInquiryPayload([
            'status' => InquiryStatus::Tamamlandi->value,
            'internal_note' => 'enjekte edilmiş not',
        ]))->assertCreated();

        $storedInquiry = Inquiry::query()->sole();

        $this->assertSame(InquiryStatus::Yeni, $storedInquiry->status);
        $this->assertNull($storedInquiry->internal_note);
    }

    /**
     * Bal küpü dolu geldiğinde yanıt başarılı bir gönderimden ayırt
     * edilememelidir — 422 dönmek bota formun engellendiğini öğretirdi.
     */
    public function test_a_filled_honeypot_is_silently_discarded(): void
    {
        Mail::fake();

        $this->postJson('/api/inquiries', $this->validInquiryPayload(['honeypot' => 'spam']))
            ->assertCreated();

        $this->assertDatabaseCount('inquiries', 0);
        Mail::assertNothingQueued();
    }

    public function test_the_endpoint_is_rate_limited_to_six_requests_per_minute(): void
    {
        Mail::fake();

        for ($attempt = 1; $attempt <= 6; $attempt++) {
            $this->postJson('/api/inquiries', $this->validInquiryPayload([
                'email' => "veli{$attempt}@example.com",
            ]))->assertCreated();
        }

        $this->postJson('/api/inquiries', $this->validInquiryPayload(['email' => 'yedinci@example.com']))
            ->assertStatus(429);
    }
}
