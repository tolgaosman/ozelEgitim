<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Facades\Storage;

final class MediaUrl
{
    /**
     * Yüklenmiş bir görselin mutlak URL'ini üretir. Yol boşsa `MissingValue`
     * döner — JsonResource bu değeri gördüğünde alanı yanıttan tamamen çıkarır,
     * böylece frontend'deki `z.string().optional()` alanı `null` yerine hiç
     * gelmemiş olur (Zod `optional` null kabul etmez).
     */
    public static function resolveOrMissing(?string $storagePath): string|MissingValue
    {
        if (blank($storagePath)) {
            return new MissingValue;
        }

        return Storage::disk('public')->url($storagePath);
    }
}
