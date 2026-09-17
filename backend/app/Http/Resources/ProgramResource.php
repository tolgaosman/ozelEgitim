<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Program;
use App\Support\IsoDate;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Alan adları kasıtlı olarak camelCase döner — frontend'deki `ProgramSchema`
 * (frontend/src/lib/schemas/program.ts) ile birebir eşleşir, araya bir
 * dönüştürme katmanı gerekmez. Bu dosya ile o şema birlikte değiştirilmeli.
 *
 * @mixin Program
 */
final class ProgramResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'icon' => $this->icon->value,
            'ageRangeLabel' => $this->age_range_label,
            'sessionFormatLabel' => $this->session_format_label,
            'highlights' => $this->highlights,
            // Görsel yüklenmemişse alan hiç gönderilmez; frontend o zaman
            // kendi slug→dosya haritasındaki yer tutucuya düşer.
            'image' => MediaUrl::resolveOrMissing($this->image_path),
            'sortOrder' => $this->sort_order,
            'publishedAt' => IsoDate::formatIsoZulu($this->published_at),
        ];
    }
}
