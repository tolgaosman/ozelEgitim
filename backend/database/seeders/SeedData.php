<?php

declare(strict_types=1);

namespace Database\Seeders;

use JsonException;
use RuntimeException;

/**
 * Seeder içeriği `database/seeders/data/*.json` dosyalarından okunur. Bu
 * dosyalar `frontend/src/mocks/*.ts` içindeki yer tutucu veriden programatik
 * olarak üretilmiştir — elle kopyalanmadıkları için metinler birebir aynıdır.
 * Merkez gerçek içeriği panelden girdikçe bu veri yalnızca ilk kurulum ve
 * testler için anlamlı kalır.
 */
final class SeedData
{
    /** @return list<array<string, mixed>> */
    public static function load(string $fileName): array
    {
        $filePath = __DIR__.'/data/'.$fileName.'.json';

        if (! is_readable($filePath)) {
            throw new RuntimeException("Seeder verisi okunamadı: {$filePath}");
        }

        try {
            /** @var list<array<string, mixed>> $decodedRecords */
            $decodedRecords = json_decode(
                (string) file_get_contents($filePath),
                associative: true,
                flags: JSON_THROW_ON_ERROR,
            );
        } catch (JsonException $decodeFailure) {
            throw new RuntimeException(
                "Seeder verisi geçerli JSON değil: {$filePath}",
                previous: $decodeFailure,
            );
        }

        return $decodedRecords;
    }
}
