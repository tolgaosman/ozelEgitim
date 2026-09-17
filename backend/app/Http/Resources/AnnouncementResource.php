<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Announcement;
use App\Support\IsoDate;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * `AnnouncementSchema` (frontend/src/lib/schemas/announcement.ts) karşılığı.
 *
 * @mixin Announcement
 */
final class AnnouncementResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'image' => MediaUrl::resolveOrMissing($this->image_path),
            'category' => $this->category->value,
            'publishedAt' => IsoDate::formatIsoZulu($this->published_at),
        ];
    }
}
