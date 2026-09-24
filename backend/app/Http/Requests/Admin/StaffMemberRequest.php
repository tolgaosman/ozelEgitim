<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\StaffMember;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StaffMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        /** @var StaffMember|null $staffMember */
        $staffMember = $this->route('staff_member');

        return [
            'fullName' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('staff_members', 'slug')->ignore($staffMember?->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'photoPath' => ['nullable', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'specialties' => ['required', 'array', 'min:1', 'max:5'],
            'specialties.*' => ['required', 'string', 'max:255'],
            'education' => ['required', 'array', 'min:1', 'max:6'],
            'education.*' => ['required', 'string', 'max:255'],
            'sortOrder' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'full_name' => $validated['fullName'],
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'photo_path' => $validated['photoPath'] ?? null,
            'bio' => $validated['bio'],
            'specialties' => $validated['specialties'],
            'education' => $validated['education'],
            'sort_order' => $validated['sortOrder'],
        ];
    }
}
