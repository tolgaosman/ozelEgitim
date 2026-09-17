<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Announcement;
use App\Models\Faq;
use App\Models\Program;
use App\Models\StaffMember;
use App\Models\Testimonial;
use Database\Seeders\SiteSettingSeeder;
use Database\Seeders\SiteStatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

final class ContentEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_announcements_match_the_frontend_schema(): void
    {
        Announcement::factory()->create();

        $this->getJson('/api/announcements')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'slug', 'title', 'excerpt', 'body', 'category', 'publishedAt'],
                ],
                'meta' => ['total'],
            ]);
    }

    public function test_announcements_are_ordered_newest_first(): void
    {
        Announcement::factory()->create(['slug' => 'eski', 'published_at' => now()->subMonth()]);
        Announcement::factory()->create(['slug' => 'yeni', 'published_at' => now()->subDay()]);

        $returnedSlugs = $this->getJson('/api/announcements')->json('data.*.slug');

        $this->assertSame(['yeni', 'eski'], $returnedSlugs);
    }

    public function test_draft_announcements_are_not_listed(): void
    {
        Announcement::factory()->draft()->create(['slug' => 'taslak']);

        $this->getJson('/api/announcements')->assertJsonCount(0, 'data');
    }

    public function test_an_unknown_announcement_slug_returns_404(): void
    {
        $this->getJson('/api/announcements/bilinmeyen')->assertNotFound();
    }

    public function test_staff_members_match_the_frontend_schema_and_are_ordered(): void
    {
        StaffMember::factory()->create(['slug' => 'ikinci', 'sort_order' => 2]);
        StaffMember::factory()->create(['slug' => 'birinci', 'sort_order' => 1]);

        $response = $this->getJson('/api/staff-members');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'slug', 'fullName', 'title', 'specialties', 'bio', 'sortOrder']],
            ]);

        $this->assertSame(['birinci', 'ikinci'], $response->json('data.*.slug'));
    }

    public function test_the_staff_photo_field_is_omitted_when_none_was_uploaded(): void
    {
        StaffMember::factory()->create(['photo_path' => null]);

        $this->assertArrayNotHasKey('photo', $this->getJson('/api/staff-members')->json('data.0'));
    }

    public function test_faqs_match_the_frontend_schema_and_hide_unpublished_entries(): void
    {
        Faq::factory()->create(['question' => 'Görünen soru?']);
        Faq::factory()->unpublished()->create(['question' => 'Gizli soru?']);

        $response = $this->getJson('/api/faqs');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['*' => ['id', 'category', 'question', 'answer', 'sortOrder']]])
            ->assertJsonCount(1, 'data');

        $this->assertSame('Görünen soru?', $response->json('data.0.question'));
    }

    public function test_testimonials_are_only_listed_once_approved(): void
    {
        Testimonial::factory()->create(['quote' => 'Onay bekleyen görüş.']);
        Testimonial::factory()->published()->create(['quote' => 'Yayındaki görüş.']);

        $response = $this->getJson('/api/testimonials');

        $response->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame('Yayındaki görüş.', $response->json('data.0.quote'));
    }

    public function test_a_testimonial_exposes_the_related_program_slug_not_its_id(): void
    {
        $program = Program::factory()->create(['slug' => 'dil-ve-konusma-terapisi']);
        Testimonial::factory()->published()->create(['program_id' => $program->id]);

        $this->getJson('/api/testimonials')
            ->assertJsonPath('data.0.programSlug', 'dil-ve-konusma-terapisi');
    }

    /**
     * Görüş listesi program ilişkisini her kayıt için ayrı ayrı sorgularsa
     * N+1 oluşur. `with('program:id,slug')` bunu tek ek sorguya indirir;
     * bu test o eager loading kaldırılırsa kırılır (Rule 01).
     */
    public function test_listing_testimonials_does_not_trigger_n_plus_one_queries(): void
    {
        $programs = Program::factory()->count(5)->create();
        foreach ($programs as $program) {
            Testimonial::factory()->published()->create(['program_id' => $program->id]);
        }

        $executedQueryCount = 0;
        DB::listen(function () use (&$executedQueryCount): void {
            $executedQueryCount++;
        });

        $this->getJson('/api/testimonials')->assertOk();

        // 1 sorgu görüşler + 1 sorgu programlar = 2.
        $this->assertLessThanOrEqual(2, $executedQueryCount);
    }

    public function test_site_settings_match_the_frontend_schema(): void
    {
        $this->seed(SiteSettingSeeder::class);
        $this->seed(SiteStatSeeder::class);

        $this->getJson('/api/site-settings')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'contact' => ['phoneDisplay', 'phoneTel', 'whatsappUrl', 'email', 'address', 'mapsUrl'],
                    'socialLinks',
                    'openingHours' => ['weekday', 'saturday', 'sunday'],
                    'kvkkBody',
                    'stats' => ['*' => ['id', 'targetValue', 'suffix', 'label', 'sortOrder']],
                ],
            ]);
    }
}
