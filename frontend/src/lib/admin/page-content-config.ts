import type { PageContentKey } from "@/lib/schemas/page-content";

export type ObjectListItemField = { key: string; label: string; type?: "text" | "textarea" };

export type BlockField =
  | { key: string; type: "text"; label: string; hint?: string }
  | { key: string; type: "textarea"; label: string; hint?: string; rows?: number }
  | { key: string; type: "image"; label: string; hint?: string }
  | { key: string; type: "string-list"; label: string; hint?: string; itemLabel?: string; min?: number; max?: number }
  | { key: string; type: "keyword-list"; label: string; hint?: string }
  | {
      key: string;
      type: "object-list";
      label: string;
      hint?: string;
      itemFields: ObjectListItemField[];
      min?: number;
      max?: number;
      fixedCount?: boolean;
    }
  | { key: string; type: "image-list"; label: string; hint?: string; min?: number; max?: number; fixedCount?: boolean };

export type PageContentBlockConfig = {
  key: PageContentKey;
  title: string;
  description?: string;
  fields: BlockField[];
};

export type PageGroupConfig = {
  slug: string;
  label: string;
  description: string;
  sitePath?: string;
  blocks: PageContentBlockConfig[];
};

const HERO_FIELDS: BlockField[] = [
  { key: "lead", type: "text", label: "Öncü satır" },
  { key: "accent", type: "text", label: "Aksan satırı (büyük harf)" },
  { key: "description", type: "textarea", label: "Açıklama" },
  { key: "image", type: "image", label: "Arka plan görseli" },
];

const SEO_FIELDS: BlockField[] = [
  { key: "title", type: "text", label: "Sayfa başlığı" },
  { key: "description", type: "textarea", label: "Meta açıklama", rows: 2 },
];

export const pageContentGroups: PageGroupConfig[] = [
  {
    slug: "ana-sayfa",
    label: "Ana Sayfa",
    description: "Karşılama, ana sayfa bölümleri ve kapanış çağrısı.",
    sitePath: "/",
    blocks: [
      {
        key: "home.hero",
        title: "Karşılama (Hero)",
        fields: [
          { key: "slides", type: "image-list", label: "Slaytlar", min: 1, max: 6 },
          { key: "announcementBadgeLabel", type: "text", label: "Duyuru rozeti metni" },
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
          { key: "subtitleText", type: "text", label: "Alt başlık" },
          { key: "hashtagText", type: "text", label: "Etiket (hashtag)" },
          { key: "ctaLabel", type: "text", label: "Buton metni" },
          { key: "scrollLabel", type: "text", label: "Kaydırma ipucu" },
        ],
      },
      {
        key: "home.individual",
        title: "Bireye Özel Program",
        fields: [
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
          { key: "body", type: "textarea", label: "Paragraf", rows: 4 },
          { key: "ctaLabel", type: "text", label: "Buton metni" },
          { key: "image", type: "image", label: "Görsel" },
        ],
      },
      {
        key: "home.difference",
        title: "Farkı Biliyoruz",
        fields: [
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
          { key: "body", type: "textarea", label: "Paragraf", rows: 3 },
          {
            key: "pillars",
            type: "object-list",
            label: "Üç sütun",
            fixedCount: true,
            itemFields: [
              { key: "title", label: "Başlık" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "home.programs_section",
        title: "Programlarımız Bölümü",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          { key: "description", type: "textarea", label: "Açıklama", rows: 2 },
          { key: "linkLabel", type: "text", label: "Bağlantı metni" },
        ],
      },
      {
        key: "home.trajectories",
        title: "Hayat Değiştiren Yolculuklar (başlık)",
        fields: [
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
        ],
      },
      {
        key: "home.campus",
        title: "Merkezimizde Yaşam",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          { key: "linkLabel", type: "text", label: "Bağlantı metni" },
          { key: "images", type: "image-list", label: "Görseller", fixedCount: true },
        ],
      },
      {
        key: "home.announcements_section",
        title: "Duyurular Bölümü",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          { key: "linkLabel", type: "text", label: "Bağlantı metni" },
          { key: "emptyTitle", type: "text", label: "Boş durum başlığı" },
          { key: "emptyDescription", type: "textarea", label: "Boş durum açıklaması", rows: 2 },
        ],
      },
      {
        key: "cta_band",
        title: "Kapanış Çağrısı (tüm sayfalarda)",
        description: "Bu bölüm ana sayfa dahil neredeyse her sayfanın altında görünür.",
        fields: [
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
          { key: "body", type: "textarea", label: "Açıklama", rows: 2 },
          { key: "ctaLabel", type: "text", label: "Buton metni" },
        ],
      },
    ],
  },
  {
    slug: "hakkimizda",
    label: "Hakkımızda",
    description: "Kuruluş hikayesi, misyon ve değerler.",
    sitePath: "/hakkimizda",
    blocks: [
      { key: "about.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      {
        key: "about.story",
        title: "Hikayemiz",
        fields: [
          { key: "leadText", type: "text", label: "Öncü satır" },
          { key: "accentText", type: "text", label: "Aksan satırı" },
          { key: "paragraphs", type: "string-list", label: "Paragraflar", min: 1, max: 6 },
          { key: "image", type: "image", label: "Görsel" },
        ],
      },
      {
        key: "about.values",
        title: "Değerlerimiz",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          {
            key: "items",
            type: "object-list",
            label: "Değerler",
            min: 1,
            max: 6,
            itemFields: [
              { key: "title", label: "Başlık" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ],
          },
        ],
      },
      { key: "seo.about", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "programlar",
    label: "Programlarımız",
    description: "Programlar listesi ve program detay sayfası metinleri.",
    sitePath: "/programlar",
    blocks: [
      { key: "programs.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      {
        key: "program_detail",
        title: "Program Detay Sayfası",
        description: "Her programın kendi detay sayfasında görünen sabit etiketler.",
        fields: [
          { key: "highlightsTitle", type: "text", label: "\"Öne çıkanlar\" başlığı" },
          { key: "detailsTitle", type: "text", label: "\"Program detayları\" başlığı" },
          { key: "ageLabel", type: "text", label: "\"Yaş aralığı\" etiketi" },
          { key: "formatLabel", type: "text", label: "\"Seans formatı\" etiketi" },
          { key: "ctaLabel", type: "text", label: "Buton metni" },
          { key: "notFoundTitle", type: "text", label: "\"Bulunamadı\" başlığı" },
        ],
      },
      { key: "seo.programs", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "duyurular",
    label: "Duyurular",
    description: "Duyuru listesi ve duyuru detay sayfası metinleri.",
    sitePath: "/duyurular",
    blocks: [
      { key: "announcements.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      {
        key: "announcement_detail",
        title: "Duyuru Detay Sayfası",
        fields: [
          { key: "breadcrumbLead", type: "text", label: "Öncü satır" },
          { key: "breadcrumbAccent", type: "text", label: "Aksan satırı" },
          { key: "fallbackImage", type: "image", label: "Yedek görsel" },
          { key: "sidebarTitle", type: "text", label: "Yan kutu başlığı" },
          { key: "sidebarBody", type: "textarea", label: "Yan kutu metni", rows: 2 },
          { key: "sidebarCtaLabel", type: "text", label: "Yan kutu buton metni" },
          { key: "otherListTitle", type: "text", label: "\"Diğer duyurular\" başlığı" },
          { key: "otherItemCtaLabel", type: "text", label: "Liste öğesi bağlantı metni" },
        ],
      },
      { key: "seo.announcements", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "kadromuz",
    label: "Kadromuz",
    description: "Kadro sayfasının üst bölümü.",
    sitePath: "/kadromuz",
    blocks: [
      { key: "staff.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      { key: "seo.staff", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "merkezimiz",
    label: "Merkezimiz",
    description: "Galeri, mekanlar ve örnek gün akışı.",
    sitePath: "/merkezimiz",
    blocks: [
      {
        key: "campus.hero",
        title: "Üst Bölüm (Hero)",
        fields: [
          { key: "lead", type: "text", label: "Öncü satır (isteğe bağlı)" },
          { key: "accent", type: "text", label: "Aksan satırı" },
          { key: "description", type: "textarea", label: "Açıklama" },
          { key: "image", type: "image", label: "Arka plan görseli" },
        ],
      },
      { key: "campus.gallery", title: "Galeri", fields: [{ key: "images", type: "image-list", label: "Görseller (4 adet)", fixedCount: true }] },
      {
        key: "campus.facilities",
        title: "Mekanlarımız",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          {
            key: "items",
            type: "object-list",
            label: "Mekanlar",
            min: 1,
            max: 6,
            itemFields: [
              { key: "title", label: "Başlık" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "campus.schedule",
        title: "Örnek Gün Akışı",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          {
            key: "items",
            type: "object-list",
            label: "Akış maddeleri",
            min: 1,
            max: 8,
            itemFields: [
              { key: "time", label: "Saat" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ],
          },
        ],
      },
      { key: "seo.campus", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "sss",
    label: "Sıkça Sorulan Sorular",
    description: "SSS sayfasının üst bölümü.",
    sitePath: "/sss",
    blocks: [
      { key: "faq.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      { key: "seo.faq", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "iletisim",
    label: "İletişim ve Başvuru",
    description: "İletişim sayfası metinleri ve kayıt adımları.",
    sitePath: "/iletisim",
    blocks: [
      { key: "contact.hero", title: "Üst Bölüm (Hero)", fields: HERO_FIELDS },
      {
        key: "contact.intro",
        title: "İletişim Bilgileri Girişi",
        fields: [
          { key: "title", type: "text", label: "Başlık" },
          { key: "description", type: "textarea", label: "Açıklama", rows: 2 },
          { key: "instagramLabel", type: "text", label: "Instagram görünen adı" },
          { key: "facebookLabel", type: "text", label: "Facebook görünen adı" },
        ],
      },
      {
        key: "contact.form_intro",
        title: "Form Girişi",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          { key: "description", type: "textarea", label: "Açıklama", rows: 2 },
        ],
      },
      {
        key: "contact.admission_steps",
        title: "Kayıt Adımları",
        fields: [
          { key: "eyebrow", type: "text", label: "Üst etiket" },
          { key: "title", type: "text", label: "Başlık" },
          {
            key: "steps",
            type: "object-list",
            label: "Adımlar",
            min: 1,
            max: 6,
            itemFields: [
              { key: "title", label: "Başlık" },
              { key: "description", label: "Açıklama", type: "textarea" },
            ],
          },
        ],
      },
      { key: "seo.contact", title: "SEO", fields: SEO_FIELDS },
    ],
  },
  {
    slug: "genel",
    label: "Genel / Ortak Alanlar",
    description: "Footer, KVKK sayfa başlığı ve site geneli SEO ayarları.",
    blocks: [
      { key: "footer", title: "Footer Sloganı", fields: [{ key: "tagline", type: "textarea", label: "Slogan", rows: 2 }] },
      { key: "kvkk.page", title: "KVKK Sayfa Başlığı", fields: [{ key: "title", type: "text", label: "Başlık" }] },
      {
        key: "seo.global",
        title: "Genel SEO",
        description: "Aksi belirtilmedikçe tüm sayfalarda kullanılan varsayılan başlık/açıklama.",
        fields: [
          { key: "defaultTitle", type: "text", label: "Varsayılan sayfa başlığı" },
          { key: "description", type: "textarea", label: "Varsayılan açıklama", rows: 2 },
          { key: "keywords", type: "keyword-list", label: "Anahtar kelimeler" },
        ],
      },
      { key: "seo.kvkk", title: "KVKK SEO", fields: SEO_FIELDS },
    ],
  },
];

export function findPageGroup(slug: string): PageGroupConfig | undefined {
  return pageContentGroups.find((group) => group.slug === slug);
}
