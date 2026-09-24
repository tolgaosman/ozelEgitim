/**
 * İkon bileşenleri (fonksiyon referansları) sunucu/istemci sınırını
 * serileştirilebilir şekilde geçemez — `(site)/layout.tsx` (Sunucu Bileşeni)
 * bu listeyi kurup `AccessibleNavbar`/`FullScreenNav`e ("use client") prop
 * olarak geçirir. Bu yüzden burada yalnızca bir ikon ANAHTARI taşınır; asıl
 * `LucideIcon` bileşenine dönüşüm `full-screen-nav.tsx`teki istemci tarafı
 * eşleme tablosunda yapılır.
 */
export type NavIconKey = "info" | "messageCircle" | "puzzle" | "activity" | "users" | "building" | "helpCircle";

export type NavChildLink = {
  label: string;
  href: string;
  description: string;
  icon: NavIconKey;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChildLink[];
};

/** Programlar alt menüsünde ikonlar sırayla döner — program sayısı panelden değişebilir. */
const PROGRAM_SUBMENU_ICONS: readonly NavIconKey[] = ["info", "messageCircle", "puzzle", "activity"];

/**
 * Gateway'in sığ bilgi mimarisinden ilham alınmıştır: her üst öğe kendi
 * başına tıklanabilir bir sayfadır, açılır menü yalnızca kısayoldur.
 * Toplam 6 üst seviye öğe ile veliler her sayfaya en fazla 2 tıkla ulaşır.
 *
 * "Programlarımız" alt menüsü panelden gelen programlarla kurulur — daha
 * önce 4 program sabit kodlanmıştı; bir program yeniden adlandırıldığında
 * veya silindiğinde menüde ölü bir bağlantı kalıyordu. `(site)/layout.tsx`
 * yayındaki programları getirip burayı çağırır.
 */
export function buildPrimaryNavigation(
  programLinks: { slug: string; name: string; shortDescription: string }[],
): NavItem[] {
  return [
    { label: "Ana Sayfa", href: "/" },
    {
      label: "Programlarımız",
      href: "/programlar",
      children: programLinks.map((program, index) => ({
        label: program.name,
        href: `/programlar/${program.slug}`,
        description: program.shortDescription,
        icon: PROGRAM_SUBMENU_ICONS[index % PROGRAM_SUBMENU_ICONS.length],
      })),
    },
    {
      label: "Kurumsal",
      href: "/hakkimizda",
      children: [
        {
          label: "Hakkımızda",
          href: "/hakkimizda",
          description: "Misyonumuz, yaklaşımımız ve merkezimizin hikayesi.",
          icon: "info",
        },
        {
          label: "Kadromuz",
          href: "/kadromuz",
          description: "Uzman eğitimci ve terapistlerimizle tanışın.",
          icon: "users",
        },
        {
          label: "Merkezimiz",
          href: "/merkezimiz",
          description: "Eğitim ortamımızı ve fiziki imkanlarımızı keşfedin.",
          icon: "building",
        },
        {
          label: "Sıkça Sorulan Sorular",
          href: "/sss",
          description: "Kayıt, süreç ve programlar hakkında merak edilenler.",
          icon: "helpCircle",
        },
      ],
    },
    { label: "Duyurular", href: "/duyurular" },
    { label: "İletişim ve Başvuru", href: "/iletisim" },
  ];
}

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
