<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\AnnouncementCategory;
use App\Models\Announcement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

final class AnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        /** @var Announcement|null $announcement */
        $announcement = $this->route('announcement');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('announcements', 'slug')->ignore($announcement?->id),
            ],
            'category' => ['required', new Enum(AnnouncementCategory::class)],
            'imagePath' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:255'],
            'body' => ['required', 'array', 'min:1'],
            'body.*' => ['required', 'string'],
            'publishedAt' => ['nullable', 'date'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'category' => $validated['category'],
            'image_path' => $validated['imagePath'] ?? null,
            'excerpt' => $validated['excerpt'],
            'body' => $validated['body'],
            'published_at' => $validated['publishedAt'] ?? null,
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
