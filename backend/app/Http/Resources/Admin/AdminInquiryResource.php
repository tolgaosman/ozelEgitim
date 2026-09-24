<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Inquiry;
use App\Support\IsoDate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Inquiry */
final class AdminInquiryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parentFullName' => $this->parent_full_name,
            'childAgeLabel' => $this->child_age_label,
            'phoneNumber' => $this->phone_number,
            'email' => $this->email,
            'programOfInterest' => $this->program_of_interest,
            'message' => $this->message,
            'status' => $this->status->value,
            'internalNote' => $this->internal_note,
            'handledAt' => IsoDate::formatIsoZulu($this->handled_at),
            'createdAt' => IsoDate::formatIsoZulu($this->created_at),
        ];
    }
}
