<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Faq;
use App\Support\IsoDate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Faq */
final class AdminFaqResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category->value,
            'question' => $this->question,
            'answer' => $this->answer,
            'isPublished' => $this->is_published,
            'sortOrder' => $this->sort_order,
            'deletedAt' => IsoDate::formatIsoZulu($this->deleted_at),
        ];
    }
}
