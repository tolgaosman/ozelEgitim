export type NavChildLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChildLink[];
};

/**
 * Gateway'in sığ bilgi mimarisinden ilham alınmıştır: her üst öğe kendi
 * başına tıklanabilir bir sayfadır, açılır menü yalnızca kısayoldur.
 * Toplam 6 üst seviye öğe ile veliler her sayfaya en fazla 2 tıkla ulaşır.
 */
export const primaryNavigation: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Programlarımız",
    href: "/programlar",
    children: [
      { label: "Tüm Programları Görüntüle", href: "/programlar" },
      { label: "Özel Öğrenme Güçlüğü Desteği", href: "/programlar/ozel-ogrenme-guclugu" },
      { label: "Dil ve Konuşma Terapisi", href: "/programlar/dil-ve-konusma-terapisi" },
      { label: "Otizm Spektrum Destek Programı", href: "/programlar/otizm-spektrum-destek" },
      { label: "Fizyoterapi ve Duyu Bütünleme", href: "/programlar/fizyoterapi-duyu-butunleme" },
    ],
  },
  {
    label: "Kurumsal",
    href: "/hakkimizda",
    children: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Kadromuz", href: "/kadromuz" },
      { label: "Merkezimizde Yaşam", href: "/yasam" },
      { label: "Sıkça Sorulan Sorular", href: "/sss" },
    ],
  },
  { label: "Duyurular", href: "/duyurular" },
  { label: "Kayıt ve Başvuru", href: "/kayit" },
  { label: "İletişim", href: "/iletisim" },
];

export const footerNavigation = {
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Kadromuz", href: "/kadromuz" },
    { label: "Merkezimizde Yaşam", href: "/yasam" },
  ],
  aileler: [
    { label: "Kayıt ve Başvuru", href: "/kayit" },
    { label: "Sıkça Sorulan Sorular", href: "/sss" },
    { label: "Duyurular", href: "/duyurular" },
  ],
  kurumsalBilgi: [
    { label: "İletişim", href: "/iletisim" },
    { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  ],
} as const;
