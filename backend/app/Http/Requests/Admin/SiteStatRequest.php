<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class SiteStatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'targetValue' => ['required', 'integer', 'min:0'],
            'suffix' => ['nullable', 'string', 'max:8'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'label' => $validated['label'],
            'target_value' => $validated['targetValue'],
            'suffix' => $validated['suffix'] ?? '',
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
