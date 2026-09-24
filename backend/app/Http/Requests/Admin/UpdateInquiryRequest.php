<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\InquiryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

/**
 * Velinin gönderdiği alanlar (ad, telefon, mesaj vb.) buradan kasıtlı
 * olarak eksiktir — panelden düzenlenmeleri kaydı velinin yazdığından
 * farklı hale getirir ve takibi yanıltır. Yalnızca merkezin kendi takip
 * alanları yazılabilir.
 */
final class UpdateInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(InquiryStatus::class)],
            'internalNote' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * `handled_at` kasıtlı olarak burada yoktur — ne zaman damgalanacağı
     * mevcut kaydın durumuna bağlıdır (bkz. AdminInquiryController::update).
     *
     * @return array<string, mixed>
     */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'status' => $validated['status'],
            'internal_note' => $validated['internalNote'] ?? null,
        ];
    }
}
