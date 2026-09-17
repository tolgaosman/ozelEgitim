<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\DispatchFrontendRevalidation;
use App\Models\Program;
use App\Models\SiteSetting;
use Database\Seeders\SiteSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * İçerik kaydedildiğinde Next.js ISR önbelleğinin tazelenmesi, panelden
 * yapılan değişikliğin sitede görünmesinin tek yoludur. Etiket adları
 * frontend'deki `tags` değerleriyle birebir eşleşmek zorundadır.
 */
final class FrontendRevalidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_saving_a_program_queues_a_revalidation_for_its_tags(): void
    {
        Queue::fake();

        Program::factory()->create(['slug' => 'ornek-program']);

        Queue::assertPushed(
            DispatchFrontendRevalidation::class,
            fn (DispatchFrontendRevalidation $job): bool => $this->jobTags($job) === [
                'programs',
                'program:ornek-program',
            ],
        );
    }

    /**
     * Slug değiştiğinde ESKİ slug'ın etiketi de tazelenmelidir; aksi halde
     * eski adres önbellekte artık var olmayan içerikle asılı kalır.
     */
    public function test_renaming_a_slug_also_revalidates_the_previous_address(): void
    {
        $program = Program::factory()->create(['slug' => 'eski-slug']);

        Queue::fake();
        $program->update(['slug' => 'yeni-slug']);

        Queue::assertPushed(
            DispatchFrontendRevalidation::class,
            fn (DispatchFrontendRevalidation $job): bool => $this->jobTags($job) === [
                'programs',
                'program:yeni-slug',
                'program:eski-slug',
            ],
        );
    }

    public function test_deleting_a_program_queues_a_revalidation(): void
    {
        $program = Program::factory()->create(['slug' => 'silinecek']);

        Queue::fake();
        $program->delete();

        Queue::assertPushed(DispatchFrontendRevalidation::class);
    }

    public function test_saving_site_settings_revalidates_the_settings_tag(): void
    {
        $this->seed(SiteSettingSeeder::class);

        Queue::fake();
        SiteSetting::current()->update(['phone_display' => '+90 533 111 11 11']);

        Queue::assertPushed(
            DispatchFrontendRevalidation::class,
            fn (DispatchFrontendRevalidation $job): bool => $this->jobTags($job) === ['site-settings'],
        );
    }

    /**
     * Tazeleme uç noktası yapılandırılmamışsa iş sessizce hiçbir şey
     * yapmalıdır — bu bir hata değil, backend'in tek başına çalıştığı
     * (ör. test, ilk kurulum) bilinçli bir durumdur.
     */
    public function test_the_job_is_a_no_op_when_the_endpoint_is_not_configured(): void
    {
        config(['services.frontend.revalidate_url' => null]);

        $revalidationJob = new DispatchFrontendRevalidation(['programs']);
        $revalidationJob->handle();

        $this->assertTrue(true, 'İş, yapılandırma yokken hata fırlatmadan tamamlandı.');
    }

    /** @return list<string> */
    private function jobTags(DispatchFrontendRevalidation $job): array
    {
        $tagsProperty = new \ReflectionProperty($job, 'cacheTags');

        return $tagsProperty->getValue($job);
    }
}
