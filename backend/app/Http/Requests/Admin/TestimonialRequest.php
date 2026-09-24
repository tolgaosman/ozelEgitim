<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class TestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'parentName' => ['required', 'string', 'max:255'],
            'relationLabel' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'programId' => ['nullable', Rule::exists('programs', 'id')],
            'isPublished' => ['required', 'boolean'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'parent_name' => $validated['parentName'],
            'relation_label' => $validated['relationLabel'],
            'quote' => $validated['quote'],
            'program_id' => $validated['programId'] ?? null,
            'is_published' => $validated['isPublished'],
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
