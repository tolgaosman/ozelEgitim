<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Announcement;
use App\Support\IsoDate;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Announcement */
final class AdminAnnouncementResource extends JsonResource
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
            'imagePath' => $this->image_path,
            'imageUrl' => MediaUrl::resolveOrMissing($this->image_path),
            'category' => $this->category->value,
            'sortOrder' => $this->sort_order,
            'publishedAt' => IsoDate::formatIsoZulu($this->published_at),
            'isPublished' => $this->published_at !== null && $this->published_at->isPast(),
            'deletedAt' => IsoDate::formatIsoZulu($this->deleted_at),
            'createdAt' => IsoDate::formatIsoZulu($this->created_at),
        ];
    }
}
