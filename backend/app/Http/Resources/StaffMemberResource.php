<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\StaffMember;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * `StaffMemberSchema` (frontend/src/lib/schemas/staff.ts) karşılığı. Fotoğraf
 * yüklenmemişse `photo` alanı gönderilmez; frontend o durumda ad-soyaddan
 * baş harf avatarı üretmeye devam eder.
 *
 * @mixin StaffMember
 */
final class StaffMemberResource extends JsonResource
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
            'bio' => $this->bio,
            'photo' => MediaUrl::resolveOrMissing($this->photo_path),
            'sortOrder' => $this->sort_order,
        ];
    }
}
