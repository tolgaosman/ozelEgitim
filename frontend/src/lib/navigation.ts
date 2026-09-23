import {
  Activity,
  Building2,
  HelpCircle,
  Info,
  LayoutGrid,
  MessageCircle,
  Puzzle,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavChildLink = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
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
      {
        label: "Özel Öğrenme Güçlüğü Desteği",
        href: "/programlar/ozel-ogrenme-guclugu",
        description: "Okuma, yazma ve matematik becerilerini güçlendiren bireysel destek.",
        icon: Info,
      },
      {
        label: "Dil ve Konuşma Terapisi",
        href: "/programlar/dil-ve-konusma-terapisi",
        description: "Dil gelişimi ve artikülasyon için uzman eşliğinde seanslar.",
        icon: MessageCircle,
      },
      {
        label: "Otizm Spektrum Destek Programı",
        href: "/programlar/otizm-spektrum-destek",
        description: "Sosyal iletişim ve günlük yaşam becerilerine odaklı bireysel program.",
        icon: Puzzle,
      },
      {
        label: "Fizyoterapi ve Duyu Bütünleme",
        href: "/programlar/fizyoterapi-duyu-butunleme",
        description: "Motor beceriler ve duyusal işlemleme için klinik destek.",
        icon: Activity,
      },
    ],
  },
  {
    label: "Kurumsal",
    href: "/hakkimizda",
    children: [
      {
        label: "Hakkımızda",
        href: "/hakkimizda",
        description: "Misyonumuz, yaklaşımımız ve merkezimizin hikayesi.",
        icon: Info,
      },
      {
        label: "Kadromuz",
        href: "/kadromuz",
        description: "Uzman eğitimci ve terapistlerimizle tanışın.",
        icon: Users,
      },
      {
        label: "Merkezimiz",
        href: "/merkezimiz",
        description: "Eğitim ortamımızı ve fiziki imkanlarımızı keşfedin.",
        icon: Building2,
      },
      {
        label: "Sıkça Sorulan Sorular",
        href: "/sss",
        description: "Kayıt, süreç ve programlar hakkında merak edilenler.",
        icon: HelpCircle,
      },
    ],
  },
  { label: "Duyurular", href: "/duyurular" },
  { label: "İletişim ve Başvuru", href: "/iletisim" },
];

export const footerNavigation = {
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Kadromuz", href: "/kadromuz" },
    { label: "Merkezimiz", href: "/merkezimiz" },
  ],
  aileler: [
    { label: "Sıkça Sorulan Sorular", href: "/sss" },
    { label: "Duyurular", href: "/duyurular" },
  ],
  kurumsalBilgi: [
    { label: "İletişim ve Başvuru", href: "/iletisim" },
    { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  ],
} as const;
