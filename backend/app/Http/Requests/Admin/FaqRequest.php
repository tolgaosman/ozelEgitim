<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\FaqCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class FaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'category' => ['required', new Enum(FaqCategory::class)],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'isPublished' => ['required', 'boolean'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'category' => $validated['category'],
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'is_published' => $validated['isPublished'],
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
