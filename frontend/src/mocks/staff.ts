import { StaffMemberSchema, type StaffMember } from "@/lib/schemas/staff";

/** YER TUTUCU VERİ — gerçek kadro bilgileri ve fotoğrafları merkezden alınacaktır. */
const rawStaffMembers: StaffMember[] = [
  {
    id: 1,
    slug: "kurucu-mudur",
    fullName: "Kurucu Müdür",
    title: "Özel Eğitim Uzmanı, Kurucu Müdür",
    specialties: ["Özel Eğitim Yönetimi", "Bireyselleştirilmiş Eğitim Programı"],
    education: ["Lisans, Özel Eğitim Öğretmenliği, Ankara Üniversitesi", "Yüksek Lisans, Eğitim Yönetimi, Gazi Üniversitesi"],
    bio: "18 yıllık özel eğitim deneyimiyle merkezin eğitim felsefesini ve kalite standartlarını yönetir.",
    sortOrder: 1,
  },
  {
    id: 2,
    slug: "bas-dil-konusma-terapisti",
    fullName: "Baş Dil ve Konuşma Terapisti",
    title: "Dil ve Konuşma Terapisti, Klinik Koordinatör",
    specialties: ["Erken Dil Gecikmesi", "Akıcılık Bozuklukları"],
    education: ["Lisans, Dil ve Konuşma Terapisi, Hacettepe Üniversitesi", "Sertifika, Akıcılık Bozuklukları Terapisi, Hacettepe Üniversitesi"],
    bio: "Dil ve konuşma terapisi ekibinin klinik süreçlerini koordine eder, aile eğitimlerini yürütür.",
    sortOrder: 2,
  },
  {
    id: 3,
    slug: "abas-uzmani",
    fullName: "ABA Uzmanı",
    title: "Uygulamalı Davranış Analisti",
    specialties: ["Otizm Spektrum Bozukluğu", "Davranış Destek Planlaması"],
    education: [
      "Lisans, Psikoloji, Boğaziçi Üniversitesi",
      "Yüksek Lisans, Uygulamalı Davranış Analizi, İstanbul Üniversitesi",
      "Uluslararası Sertifika, Board Certified Behavior Analyst (BCBA)",
    ],
    bio: "Bireysel davranış destek planlarını hazırlar ve uygulayıcı ekibi süpervize eder.",
    sortOrder: 3,
  },
  {
    id: 4,
    slug: "cocuk-fizyoterapisti",
    fullName: "Çocuk Fizyoterapisti",
    title: "Fizyoterapist, Duyu Bütünleme Uzmanı",
    specialties: ["Duyu Bütünleme Terapisi", "Nörogelişimsel Fizyoterapi"],
    education: ["Lisans, Fizyoterapi ve Rehabilitasyon, Dokuz Eylül Üniversitesi", "Sertifika, Duyu Bütünleme Terapisi, DEBRA Derneği"],
    bio: "Duyu bütünleme salonunda bireysel motor gelişim programlarını yürütür.",
    sortOrder: 4,
  },
];

export const mockStaffMembers: StaffMember[] = rawStaffMembers.map((staffMember) =>
  StaffMemberSchema.parse(staffMember),
);
