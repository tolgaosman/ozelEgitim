import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_MAPS_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_SOCIAL_LINKS,
  SITE_WHATSAPP_URL,
} from "@/lib/seo/constants";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas/site-settings";

/**
 * YER TUTUCU VERİ — backend erişilemediğinde kullanılır. Kaynak, projenin
 * başından beri var olan `src/lib/seo/constants.ts` sabitleridir; böylece
 * iletişim bilgisi tek bir yerde tanımlı kalır ve burada kopyalanmaz.
 * `.parse` çağrısı bu verinin SiteSettingsSchema ile uyumlu kalmasını
 * çalışma anında garanti eder.
 */
const rawSiteSettings: SiteSettings = {
  contact: {
    phoneDisplay: SITE_PHONE_DISPLAY,
    phoneTel: SITE_PHONE_TEL,
    whatsappUrl: SITE_WHATSAPP_URL,
    email: SITE_EMAIL,
    address: SITE_ADDRESS,
    mapsUrl: SITE_MAPS_URL,
  },
  socialLinks: {
    instagram: SITE_SOCIAL_LINKS.instagram,
    facebook: SITE_SOCIAL_LINKS.facebook,
    youtube: SITE_SOCIAL_LINKS.youtube,
  },
  openingHours: {
    weekday: "08:30 – 17:30",
    saturday: "08:30 – 12:30",
    sunday: "Kapalı",
  },
  kvkkBody: [
    'İz Özel Eğitim Merkezi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine önem veriyoruz.',
    "İletişim formu ve kayıt başvurusu aracılığıyla paylaştığınız ad-soyad, telefon, e-posta ve çocuğunuza ilişkin bilgiler; yalnızca ön görüşme sürecinin yürütülmesi ve eğitim hizmetlerinin planlanması amacıyla işlenir.",
    "Kişisel verileriniz, açık rızanız veya kanunlarda öngörülen diğer veri işleme şartları dışında üçüncü kişilerle paylaşılmaz.",
    "KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@izozelegitim.com adresinden bizimle iletişime geçebilirsiniz.",
    "Bu metin yer tutucu niteliktedir; nihai aydınlatma metni merkezimizin hukuk danışmanlığı tarafından hazırlanıp yayımlanacaktır.",
  ],
  stats: [
    { id: 1, targetValue: 18, suffix: "+", label: "Yıllık Deneyim", sortOrder: 0 },
    { id: 2, targetValue: 620, suffix: "+", label: "Desteklenen Çocuk", sortOrder: 1 },
    { id: 3, targetValue: 8, suffix: "", label: "Uzmanlık Alanında Program", sortOrder: 2 },
    { id: 4, targetValue: 94, suffix: "%", label: "Ailelerin Memnuniyet Oranı", sortOrder: 3 },
  ],
};

export const mockSiteSettings: SiteSettings = SiteSettingsSchema.parse(rawSiteSettings);
