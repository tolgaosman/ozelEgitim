<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Models\SiteStat;
use App\Models\User;
use Illuminate\Validation\ValidationException;

final class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        $stats = SiteStat::query()->orderBy('sort_order')->get();

        return SiteSettingResource::make(SiteSetting::current(), $stats);
    }

    /**
     * Panel girişi işletme e-postasına bağlıdır (bkz. AdminAuthController),
     * bu yüzden bu e-posta değiştiğinde yönetici hesabının e-postası da
     * burada senkronize edilir — aksi halde bir sonraki girişte "şifre
     * hatalı" gibi görünen bir kilitlenme yaşanırdı.
     */
    public function update(SiteSettingRequest $request): SiteSettingResource
    {
        $setting = SiteSetting::current();
        $previousEmail = $setting->email;
        $newEmail = $request->validated('email');

        // Senkronizasyondan önce doğrulanır: aksi halde `users.email` tekillik
        // kısıtı bir istisna fırlatır ve site ayarları, yönetici hesabıyla
        // senkron olmayan yarım bir durumda kalırdı.
        if ($newEmail !== $previousEmail && User::query()->where('email', $newEmail)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['Bu e-posta adresi zaten kullanılıyor.'],
            ]);
        }

        $setting->update($request->toDatabaseAttributes());

        if ($newEmail !== $previousEmail) {
            User::query()
                ->where('email', $previousEmail)
                ->where('is_admin', true)
                ->update(['email' => $newEmail]);
        }

        $stats = SiteStat::query()->orderBy('sort_order')->get();

        return SiteSettingResource::make($setting->refresh(), $stats);
    }
}
