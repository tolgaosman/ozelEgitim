<?php

declare(strict_types=1);

namespace App\Support;

use Carbon\CarbonInterface;

final class IsoDate
{
    /**
     * Frontend'in Zod v4 şemaları `z.iso.datetime()` kullanır ve bu doğrulayıcı
     * sayısal UTC farkını (`+00:00`) REDDEDER — yalnızca `Z` sonekini kabul
     * eder. Bu yüzden Carbon'un `toIso8601String()` metodu burada kullanılamaz.
     * Üretilen biçim `2026-01-15T09:00:00.000Z` olup frontend'deki yer tutucu
     * verinin (src/mocks) biçimiyle birebir aynıdır.
     */
    public static function formatIsoZulu(?CarbonInterface $moment): ?string
    {
        return $moment?->utc()->format('Y-m-d\TH:i:s.v\Z');
    }
}
