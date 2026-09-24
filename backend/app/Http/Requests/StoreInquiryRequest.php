<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Kurallar frontend'deki `InquirySchema` (frontend/src/lib/schemas/inquiry.ts)
 * ile birebir aynıdır. İki tarafta da doğrulama yapılması kasıtlıdır: Zod
 * kullanıcıya anında geri bildirim verir, bu Form Request ise API'ye doğrudan
 * gelen istekleri savunur (Rule 03 — sıfır güven).
 */
final class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // herkese açık ön görüşme formu
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'parentFullName' => ['required', 'string', 'min:2', 'max:120'],
            'childAgeLabel' => ['required', 'string', 'max:30'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9+()\s-]{10,20}$/u'],
            'email' => ['nullable', 'email:rfc', 'max:160'],
            'programOfInterest' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
            // Bal küpü alanı: gerçek ziyaretçi bunu hiç görmez, dolduran bir
            // bottur. Burada BİLEREK doğrulama hatası üretilmez — 422 dönmek
            // bota formun engellendiğini öğretirdi. Alan yalnızca yük boyutu
            // için sınırlanır; dolu geldiğinde isteği sessizce yutma işini
            // InquiryController üstlenir (Rule 03).
            'honeypot' => ['nullable', 'string', 'max:255'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'parentFullName.required' => 'Ad ve soyad zorunludur.',
            'parentFullName.min' => 'Ad ve soyad en az 2 karakter olmalıdır.',
            'childAgeLabel.required' => 'Çocuğunuzun yaşını belirtmeniz gerekir.',
            'phoneNumber.required' => 'Telefon numarası zorunludur.',
            'phoneNumber.regex' => 'Geçerli bir telefon numarası giriniz.',
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'message.max' => 'Mesajınız en fazla 1000 karakter olabilir.',
        ];
    }

    /**
     * Doğrulanmış camelCase girdiyi veritabanı sütun adlarına çevirir. Bal
     * küpü alanı bilinçli olarak dışarıda bırakılır — saklanacak bir veri değil.
     *
     * @return array<string, ?string>
     */
    public function toDatabaseAttributes(): array
    {
        $validatedInput = $this->validated();

        return [
            'parent_full_name' => $validatedInput['parentFullName'],
            'child_age_label' => $validatedInput['childAgeLabel'],
            'phone_number' => $validatedInput['phoneNumber'],
            'email' => $validatedInput['email'] ?? null,
            'program_of_interest' => blank($validatedInput['programOfInterest'] ?? null)
                ? null
                : $validatedInput['programOfInterest'],
            'message' => blank($validatedInput['message'] ?? null)
                ? null
                : $validatedInput['message'],
        ];
    }
}
