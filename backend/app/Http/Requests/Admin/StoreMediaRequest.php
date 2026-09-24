<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,png,webp',
                'max:4096',
            ],
            'directory' => [
                'required',
                'string',
                'in:programs,announcements,staff,page-content',
            ],
        ];
    }
}
