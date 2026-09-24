<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\StaffMember;
use App\Support\IsoDate;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin StaffMember */
final class AdminStaffMemberResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'fullName' => $this->full_name,
            'title' => $this->title,
            'specialties' => $this->specialties,
            'education' => $this->education ?? [],
            'bio' => $this->bio,
            'photoPath' => $this->photo_path,
            'photoUrl' => MediaUrl::resolveOrMissing($this->photo_path),
            'sortOrder' => $this->sort_order,
            'deletedAt' => IsoDate::formatIsoZulu($this->deleted_at),
            'createdAt' => IsoDate::formatIsoZulu($this->created_at),
        ];
    }
}
