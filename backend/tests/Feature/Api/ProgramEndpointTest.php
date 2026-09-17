<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Program;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProgramEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_programs_in_the_shape_the_frontend_schema_expects(): void
    {
        Program::factory()->create(['slug' => 'ornek-program', 'sort_order' => 1]);

        $response = $this->getJson('/api/programs');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'slug', 'name', 'shortDescription', 'description',
                        'icon', 'ageRangeLabel', 'sessionFormatLabel', 'highlights',
                        'sortOrder', 'publishedAt',
                    ],
                ],
                'meta' => ['total'],
            ]);
    }

    /**
     * En kritik sözleşme testi. Frontend'in Zod şeması `z.iso.datetime()`
     * kullanır ve bu doğrulayıcı sayısal UTC farkını (`+00:00`) reddeder.
     * Carbon'un varsayılan `toIso8601String()` metodu tam olarak o biçimi
     * üretir; bu test yanlışlıkla ona dönülmesini engeller.
     */
    public function test_published_at_is_formatted_as_zulu_time_for_zod(): void
    {
        Program::factory()->create();

        $publishedAt = $this->getJson('/api/programs')->json('data.0.publishedAt');

        $this->assertMatchesRegularExpression(
            '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/',
            $publishedAt,
        );
    }

    public function test_highlights_are_returned_as_title_description_objects(): void
    {
        Program::factory()->create([
            'highlights' => [['title' => 'Okuma', 'description' => 'Akıcılık çalışmaları.']],
        ]);

        $this->getJson('/api/programs')
            ->assertJsonPath('data.0.highlights.0.title', 'Okuma')
            ->assertJsonPath('data.0.highlights.0.description', 'Akıcılık çalışmaları.');
    }

    public function test_the_image_field_is_omitted_when_no_image_was_uploaded(): void
    {
        // Zod'da `image` alanı `optional` — `null` göndermek doğrulamadan
        // düşerdi, bu yüzden alan tamamen çıkarılmalıdır.
        Program::factory()->create(['image_path' => null]);

        $firstProgram = $this->getJson('/api/programs')->json('data.0');

        $this->assertArrayNotHasKey('image', $firstProgram);
    }

    public function test_the_image_field_is_an_absolute_url_when_an_image_was_uploaded(): void
    {
        Program::factory()->create(['image_path' => 'programs/ornek.jpg']);

        $imageUrl = $this->getJson('/api/programs')->json('data.0.image');

        $this->assertStringContainsString('/storage/programs/ornek.jpg', (string) $imageUrl);
    }

    public function test_drafts_scheduled_and_deleted_programs_are_never_listed(): void
    {
        Program::factory()->create(['slug' => 'yayinda']);
        Program::factory()->draft()->create(['slug' => 'taslak']);
        Program::factory()->scheduled()->create(['slug' => 'zamanlanmis']);
        Program::factory()->create(['slug' => 'silinmis'])->delete();

        $returnedSlugs = $this->getJson('/api/programs')->json('data.*.slug');

        $this->assertSame(['yayinda'], $returnedSlugs);
    }

    public function test_programs_are_ordered_by_sort_order(): void
    {
        Program::factory()->create(['slug' => 'ucuncu', 'sort_order' => 30]);
        Program::factory()->create(['slug' => 'birinci', 'sort_order' => 10]);
        Program::factory()->create(['slug' => 'ikinci', 'sort_order' => 20]);

        $returnedSlugs = $this->getJson('/api/programs')->json('data.*.slug');

        $this->assertSame(['birinci', 'ikinci', 'ucuncu'], $returnedSlugs);
    }

    public function test_it_returns_a_single_program_by_slug(): void
    {
        Program::factory()->create(['slug' => 'dil-ve-konusma-terapisi']);

        $this->getJson('/api/programs/dil-ve-konusma-terapisi')
            ->assertOk()
            ->assertJsonPath('data.slug', 'dil-ve-konusma-terapisi');
    }

    public function test_an_unknown_slug_returns_404_rather_than_an_empty_payload(): void
    {
        $this->getJson('/api/programs/bilinmeyen-slug')->assertNotFound();
    }

    public function test_a_draft_program_is_not_reachable_by_its_slug(): void
    {
        Program::factory()->draft()->create(['slug' => 'gizli-taslak']);

        $this->getJson('/api/programs/gizli-taslak')->assertNotFound();
    }
}
