<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * `TestimonialSchema` (frontend/src/lib/schemas/testimonial.ts) karşılığı.
 * Veritabanında `program_id` tutulur ama frontend slug bekler; ilişki
 * controller'da `with()` ile önceden yüklenir (N+1 önlemi).
 *
 * @mixin Testimonial
 */
final class TestimonialResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parentName' => $this->parent_name,
            'relationLabel' => $this->relation_label,
            'quote' => $this->quote,
            'programSlug' => $this->whenLoaded(
                'program',
                fn (): ?string => $this->program?->slug,
            ),
        ];
    }
}
