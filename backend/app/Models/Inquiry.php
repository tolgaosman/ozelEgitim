<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\InquiryStatus;
use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Inquiry extends Model
{
    /** @use HasFactory<InquiryFactory> */
    use HasFactory;

    protected $table = 'inquiries';

    /**
     * `status`, `internal_note` ve `handled_at` bilinçli olarak listede:
     * yalnızca yönetim panelinden güncellenirler. Herkese açık uç nokta
     * `StoreInquiryRequest::validated()` sonucunu geçirdiği için ziyaretçi
     * bu alanlara değer yazamaz (Rule 03 — kütle atama kontrolü).
     */
    protected $fillable = [
        'parent_full_name',
        'child_age_label',
        'phone_number',
        'email',
        'program_of_interest',
        'message',
        'status',
        'internal_note',
        'ip_hash',
        'handled_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => InquiryStatus::class,
            'handled_at' => 'datetime',
        ];
    }
}
