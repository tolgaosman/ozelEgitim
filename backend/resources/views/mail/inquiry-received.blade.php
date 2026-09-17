<x-mail::message>
# Yeni ön görüşme talebi

İletişim formundan yeni bir talep geldi.

<x-mail::panel>
**Veli:** {{ $inquiry->parent_full_name }}
**Çocuğun yaşı:** {{ $inquiry->child_age_label }}
**Telefon:** {{ $inquiry->phone_number }}
**E-posta:** {{ $inquiry->email }}
@if ($inquiry->program_of_interest)
**İlgilenilen program:** {{ $inquiry->program_of_interest }}
@endif
</x-mail::panel>

@if ($inquiry->message)
## Veli notu

{{ $inquiry->message }}
@endif

<x-mail::button :url="url('/admin/inquiries/' . $inquiry->getKey())">
Panelde aç
</x-mail::button>

Talep {{ $inquiry->created_at?->timezone(config('app.timezone'))->format('d.m.Y H:i') }} tarihinde alındı.

{{ config('app.name') }}
</x-mail::message>
