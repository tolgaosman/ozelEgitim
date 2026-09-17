<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * İçerik panelden kaydedildiğinde Next.js'in ISR önbelleğini tazeler.
 * Bu olmadan değişiklikler `revalidate: 300` süresi dolana kadar sitede
 * görünmezdi.
 *
 * Kuyruğa alınır ve hata durumunda ÇÖKMEZ: tazeleme yapılamaması içerik
 * kaydını geçersiz kılmaz, yalnızca sitenin birkaç dakika eski kalmasına
 * yol açar. Bu yüzden başarısızlık loglanır ve iş yeniden denenir.
 */
final class DispatchFrontendRevalidation implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var list<int> Yeniden deneme aralıkları (saniye). */
    public array $backoff = [10, 60];

    /** @param list<string> $cacheTags */
    public function __construct(private readonly array $cacheTags) {}

    public function handle(): void
    {
        $revalidateUrl = config('services.frontend.revalidate_url');
        $sharedSecret = config('services.frontend.revalidate_secret');

        // Yapılandırılmamışsa (ör. testler, tek başına çalışan backend)
        // sessizce atlanır — bu bir hata değil, bilinçli bir durumdur.
        if (blank($revalidateUrl) || blank($sharedSecret)) {
            return;
        }

        $httpResponse = Http::asJson()
            ->withHeader('X-Revalidate-Secret', $sharedSecret)
            ->timeout(5)
            ->post($revalidateUrl, ['tags' => $this->cacheTags]);

        $httpResponse->throw();
    }

    public function failed(Throwable $failureReason): void
    {
        Log::warning('Next.js ISR tazeleme isteği başarısız oldu.', [
            'tags' => $this->cacheTags,
            'reason' => $failureReason->getMessage(),
        ]);
    }
}
