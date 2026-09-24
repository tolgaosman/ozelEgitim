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

        if (str_starts_with($storagePath, 'http://') || str_starts_with($storagePath, 'https://')) {
            return $storagePath;
        }

        return Storage::disk('public')->url($storagePath);
    }

    /**
     * Sayfa içeriği bloklarındaki görsel alanları için: `PageContentBlueprint`
     * varsayılanları site kökünden başlayan yollardır (`/images/...`, Next.js
     * `public/` dizininden servis edilir) ve olduğu gibi bırakılır. Panelden
     * yüklenen bir görsel ise `page-content/xxxx.jpg` gibi göreli bir storage
     * yoludur ve mutlak bir URL'e çevrilmesi gerekir.
     */
    public static function resolvePageContentValue(string $value): string
    {
        if ($value === '' || str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}
