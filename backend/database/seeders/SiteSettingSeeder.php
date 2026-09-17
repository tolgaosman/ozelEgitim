<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

/**
 * Değerler `frontend/src/lib/seo/constants.ts`, `src/app/iletisim/page.tsx`
 * ve `src/app/kvkk/page.tsx` içindeki mevcut sabitlerden alınmıştır. O
 * dosyalar silinmez — backend erişilemediğinde yedek kaynak olarak kalırlar.
 */
final class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'phone_display' => '+90 533 888 14 05',
                'phone_tel' => '+905338881405',
                'whatsapp_url' => 'https://wa.me/905338881405',
                'email' => 'izozelegitim@yahoo.com',
                'address' => 'Şht. Ecvet Yusuf Caddesi No: 58 Yenişehir/Lefkoşa, Nicosia, Cyprus',
                'maps_url' => 'https://maps.app.goo.gl/FtB5svk8jzdg4jSw7',
                'instagram_url' => 'https://www.instagram.com/iz_ozel_rehabilitasyon/',
                'facebook_url' => 'https://www.facebook.com/p/İZ-Özel-Eğitim-ve-Rehabilitasyon-Merkezi-100063796425577/',
                'youtube_url' => 'https://www.youtube.com/@izozelegitim',
                'weekday_hours' => '08:30 – 17:30',
                'saturday_hours' => '08:30 – 12:30',
                'sunday_hours' => 'Kapalı',
                // YER TUTUCU METİN — yayına alınmadan önce merkezin hukuk
                // danışmanı tarafından 6698 sayılı KVKK'ya uygun şekilde
                // hazırlanmalı ve panelden güncellenmelidir.
                'kvkk_body' => [
                    'İz Özel Eğitim Merkezi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine önem veriyoruz.',
                    'İletişim formu ve kayıt başvurusu aracılığıyla paylaştığınız ad-soyad, telefon, e-posta ve çocuğunuza ilişkin bilgiler; yalnızca ön görüşme sürecinin yürütülmesi ve eğitim hizmetlerinin planlanması amacıyla işlenir.',
                    'Kişisel verileriniz, açık rızanız veya kanunlarda öngörülen diğer veri işleme şartları dışında üçüncü kişilerle paylaşılmaz.',
                    'KVKK\'nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@izozelegitim.com adresinden bizimle iletişime geçebilirsiniz.',
                    'Bu metin yer tutucu niteliktedir; nihai aydınlatma metni merkezimizin hukuk danışmanlığı tarafından hazırlanıp yayımlanacaktır.',
                ],
            ],
        );
    }
}
