<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ProgramIcon;
use App\Models\Program;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * Alan kısıtları frontend'deki `ProgramSchema` ile birebir aynıdır — daha
 * önce `app/Filament/Resources/Programs/Schemas/ProgramForm.php` içinde
 * tanımlıydı (Filament kaldırıldı, kısıtlar buraya taşındı).
 */
final class ProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        /** @var Program|null $program */
        $program = $this->route('program');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('programs', 'slug')->ignore($program?->id),
            ],
            'shortDescription' => ['required', 'string', 'max:255'],
            'icon' => ['required', new Enum(ProgramIcon::class)],
            'imagePath' => ['nullable', 'string', 'max:255'],
            'ageRangeLabel' => ['required', 'string', 'max:255'],
            'sessionFormatLabel' => ['required', 'string', 'max:255'],
            'description' => ['required', 'array', 'min:1'],
            'description.*' => ['required', 'string'],
            'highlights' => ['required', 'array', 'min:1', 'max:6'],
            'highlights.*.title' => ['required', 'string', 'max:255'],
            'highlights.*.description' => ['required', 'string'],
            'publishedAt' => ['nullable', 'date'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'short_description' => $validated['shortDescription'],
            'icon' => $validated['icon'],
            'image_path' => $validated['imagePath'] ?? null,
            'age_range_label' => $validated['ageRangeLabel'],
            'session_format_label' => $validated['sessionFormatLabel'],
            'description' => $validated['description'],
            'highlights' => $validated['highlights'],
            'published_at' => $validated['publishedAt'] ?? null,
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
