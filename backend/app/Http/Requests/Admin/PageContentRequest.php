<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Support\PageContentBlueprint;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Kuralları sabit değildir — URL'deki `{key}` parametresine göre
 * `PageContentBlueprint`'ten okunur. Bilinmeyen bir anahtar için istek
 * 404'e düşer (bkz. `AdminPageContentController::update`'in çağırdığı
 * `failedValidation` yerine burada erken atılan istisna).
 */
final class PageContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $key = (string) $this->route('key');
        $rules = PageContentBlueprint::rulesFor($key);

        if ($rules === null) {
            throw new NotFoundHttpException("Bilinmeyen sayfa içeriği anahtarı: {$key}");
        }

        return $rules;
    }

    protected function withValidator(Validator $validator): void
    {
        // Fazladan alan gönderilmesi (blueprint'te tanımlı olmayan bir anahtar)
        // sessizce yutulmaz — panel ile blueprint arasında bir sapma olduğunda
        // hemen fark edilsin diye reddedilir.
        $validator->after(function (Validator $validator): void {
            $key = (string) $this->route('key');
            $allowedFields = array_keys(PageContentBlueprint::rulesFor($key) ?? []);
            $topLevelAllowed = array_unique(array_map(
                static fn (string $field): string => explode('.', $field)[0],
                $allowedFields,
            ));

            foreach (array_keys($this->all()) as $field) {
                if (! in_array($field, $topLevelAllowed, true)) {
                    $validator->errors()->add($field, 'Bu alan bu içerik bloğunda tanımlı değil.');
                }
            }
        });
    }
}
