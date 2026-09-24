<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Testimonial */
final class AdminTestimonialResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parentName' => $this->parent_name,
            'relationLabel' => $this->relation_label,
            'quote' => $this->quote,
            'programId' => $this->program_id,
            'programName' => $this->whenLoaded('program', fn (): ?string => $this->program?->name),
            'isPublished' => $this->is_published,
            'sortOrder' => $this->sort_order,
        ];
    }
}
