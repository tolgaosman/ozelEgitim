<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/** Alan kısıtları `SiteSettingsSchema` (frontend/src/lib/schemas/site-settings.ts) ile birebir aynıdır. */
final class SiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'phoneDisplay' => ['required', 'string', 'max:255'],
            'phoneTel' => ['required', 'string', 'max:255'],
            'whatsappUrl' => ['required', 'string', 'url', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'mapsUrl' => ['required', 'string', 'url', 'max:255'],
            'instagramUrl' => ['nullable', 'string', 'url', 'max:255'],
            'facebookUrl' => ['nullable', 'string', 'url', 'max:255'],
            'youtubeUrl' => ['nullable', 'string', 'url', 'max:255'],
            'weekdayHours' => ['required', 'string', 'max:255'],
            'saturdayHours' => ['required', 'string', 'max:255'],
            'sundayHours' => ['required', 'string', 'max:255'],
            'kvkkBody' => ['required', 'array', 'min:1'],
            'kvkkBody.*' => ['required', 'string'],
        ];
    }

    /** @return array<string, mixed> */
    public function toDatabaseAttributes(): array
    {
        $validated = $this->validated();

        return [
            'phone_display' => $validated['phoneDisplay'],
            'phone_tel' => $validated['phoneTel'],
            'whatsapp_url' => $validated['whatsappUrl'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'maps_url' => $validated['mapsUrl'],
            'instagram_url' => $validated['instagramUrl'] ?? null,
            'facebook_url' => $validated['facebookUrl'] ?? null,
            'youtube_url' => $validated['youtubeUrl'] ?? null,
            'weekday_hours' => $validated['weekdayHours'],
            'saturday_hours' => $validated['saturdayHours'],
            'sunday_hours' => $validated['sundayHours'],
            'kvkk_body' => $validated['kvkkBody'],
        ];
    }
}
