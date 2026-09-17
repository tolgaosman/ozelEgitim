<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * `FaqSchema` (frontend/src/lib/schemas/faq.ts) karşılığı.
 *
 * @mixin Faq
 */
final class FaqResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category->value,
            'question' => $this->question,
            'answer' => $this->answer,
            'sortOrder' => $this->sort_order,
        ];
    }
}
