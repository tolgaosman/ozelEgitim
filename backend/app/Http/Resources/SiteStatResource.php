<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\SiteStat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SiteStat */
final class SiteStatResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'targetValue' => $this->target_value,
            'suffix' => $this->suffix,
            'label' => $this->label,
            'sortOrder' => $this->sort_order,
        ];
    }
}
