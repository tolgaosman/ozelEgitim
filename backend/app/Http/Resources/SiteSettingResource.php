<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\SiteSetting;
use App\Models\SiteStat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * `SiteSettingsSchema` (frontend/src/lib/schemas/site-settings.ts) karşılığı.
 * İletişim bilgileri, çalışma saatleri, KVKK metni ve sayaç kartları tek bir
 * istekte döner — bu veriler neredeyse her sayfada birlikte kullanılıyor,
 * ayrı uç noktalara bölmek gereksiz gidiş-geliş yaratırdı.
 *
 * Sayaçlar ayrı bir tabloda ve `site_settings` ile aralarında yabancı anahtar
 * ilişkisi yok; bu yüzden gizli bir sorgu yerine yapıcıdan açıkça geçilir.
 *
 * @mixin SiteSetting
 */
final class SiteSettingResource extends JsonResource
{
    /** @param Collection<int, SiteStat> $stats */
    public function __construct(
        SiteSetting $setting,
        private readonly Collection $stats,
    ) {
        parent::__construct($setting);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'contact' => [
                'phoneDisplay' => $this->phone_display,
                'phoneTel' => $this->phone_tel,
                'whatsappUrl' => $this->whatsapp_url,
                'email' => $this->email,
                'address' => $this->address,
                'mapsUrl' => $this->maps_url,
            ],
            // Boş bırakılan bir sosyal medya bağlantısı `null` olarak değil,
            // hiç gönderilmeyerek atlanır — Zod `optional` null kabul etmez.
            'socialLinks' => array_filter([
                'instagram' => $this->instagram_url,
                'facebook' => $this->facebook_url,
                'youtube' => $this->youtube_url,
            ], static fn (?string $link): bool => filled($link)),
            'openingHours' => [
                'weekday' => $this->weekday_hours,
                'saturday' => $this->saturday_hours,
                'sunday' => $this->sunday_hours,
            ],
            'kvkkBody' => $this->kvkk_body,
            'stats' => SiteStatResource::collection($this->stats)->resolve($request),
        ];
    }
}
