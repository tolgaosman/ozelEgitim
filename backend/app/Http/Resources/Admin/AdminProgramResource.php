<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Program;
use App\Support\IsoDate;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Genel `ProgramResource`'un aksine panel bu kaynağı hem listelemede hem
 * düzenleme formunu doldururken kullanır — bu yüzden taslak kayıtlar da
 * (published_at boş) dahildir ve ham depolama yolu (`imagePath`) da döner.
 *
 * @mixin Program
 */
final class AdminProgramResource extends JsonResource
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
            'imagePath' => $this->image_path,
            'imageUrl' => MediaUrl::resolveOrMissing($this->image_path),
            'sortOrder' => $this->sort_order,
            'publishedAt' => IsoDate::formatIsoZulu($this->published_at),
            'isPublished' => $this->published_at !== null && $this->published_at->isPast(),
            'deletedAt' => IsoDate::formatIsoZulu($this->deleted_at),
            'createdAt' => IsoDate::formatIsoZulu($this->created_at),
        ];
    }
}
