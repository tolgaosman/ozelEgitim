import { ProgramSchema, type Program } from "@/lib/schemas/program";

/**
 * YER TUTUCU VERİ — Laravel backend'i devreye girene kadar kullanılır.
 * Gerçek program içerikleri, süre ve ücret bilgileri merkez yönetiminden
 * alınmalıdır. `.parse` çağrısı, bu verinin ProgramSchema ile sürekli
 * uyumlu kalmasını derleme/çalışma anında garanti eder.
 */
const rawPrograms: Program[] = [
  {
    id: 1,
    slug: "ozel-ogrenme-guclugu",
    name: "Özel Öğrenme Güçlüğü Destek Programı",
    shortDescription:
      "Okuma, yazma ve matematik becerilerinde bireyselleştirilmiş, kanıta dayalı destek eğitimi.",
    description: [
      "Disleksi, disgrafi ve diskalkuli tanılı çocuklar için akademik becerileri güçlendiren bire bir eğitim oturumları sunuyoruz.",
      "Her çocuk için RAM raporu doğrultusunda hazırlanan Bireyselleştirilmiş Eğitim Programı (BEP) haftalık olarak güncellenir.",
    ],
    icon: "puzzle",
    ageRangeLabel: "6-14 yaş",
    sessionFormatLabel: "Bire bir, haftada 2-3 seans",
    highlights: [
      "Okuma akıcılığı ve anlama çalışmaları",
      "Yazılı anlatım ve el yazısı desteği",
      "Sayı algısı ve matematik akıl yürütme",
      "Veli bilgilendirme görüşmeleri",
    ],
    sortOrder: 1,
    publishedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 2,
    slug: "dil-ve-konusma-terapisi",
    name: "Dil ve Konuşma Terapisi",
    shortDescription:
      "Konuşma sesi bozuklukları, dil gecikmesi ve akıcılık güçlüklerinde uzman terapist desteği.",
    description: [
      "Alanında uzman dil ve konuşma terapistlerimiz, çocuğun iletişim becerilerini günlük yaşama taşıyacak şekilde çalışır.",
      "Aile katılımlı seanslarla evde uygulanabilecek pekiştirme teknikleri aktarılır.",
    ],
    icon: "message-circle",
    ageRangeLabel: "2-12 yaş",
    sessionFormatLabel: "Bire bir, haftada 1-3 seans",
    highlights: [
      "Artikülasyon ve sesletim çalışmaları",
      "Alıcı ve ifade edici dil gelişimi",
      "Kekemelik ve akıcılık desteği",
      "Erken dil gecikmesi müdahalesi",
    ],
    sortOrder: 2,
    publishedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 3,
    slug: "otizm-spektrum-destek",
    name: "Otizm Spektrum Destek Programı",
    shortDescription:
      "Sosyal iletişim, davranış ve günlük yaşam becerilerini geliştiren yapılandırılmış eğitim.",
    description: [
      "Uygulamalı Davranış Analizi (ABA) temelli bireysel programlarla sosyal etkileşim ve iletişim becerileri desteklenir.",
      "Duyusal hassasiyetler gözetilerek sakin, öngörülebilir bir öğrenme ortamı sunulur.",
    ],
    icon: "puzzle",
    ageRangeLabel: "2-16 yaş",
    sessionFormatLabel: "Bire bir ve küçük grup, haftada 2-5 seans",
    highlights: [
      "Sosyal beceri ve oyun terapisi grupları",
      "Görsel destekli iletişim sistemleri",
      "Davranış destek planları",
      "Aile eğitimi ve danışmanlık",
    ],
    sortOrder: 3,
    publishedAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: 4,
    slug: "zihinsel-yetersizlik-destek",
    name: "Zihinsel Yetersizlik Destek Eğitimi",
    shortDescription:
      "Bağımsız yaşam ve akademik beceriler için basamaklı, somut öğretim yöntemleri.",
    description: [
      "Öz bakım, günlük yaşam ve temel akademik becerileri hedefleyen adım adım öğretim teknikleri uygulanır.",
      "İlerleme, her dönem RAM raporu ve gözlem verileriyle birlikte veliyle paylaşılır.",
    ],
    icon: "brain",
    ageRangeLabel: "4-18 yaş",
    sessionFormatLabel: "Bire bir ve küçük grup, haftada 2-4 seans",
    highlights: [
      "Öz bakım ve günlük yaşam becerileri",
      "Temel akademik kavram çalışmaları",
      "İş ve meslek öncesi beceri hazırlığı",
      "Bireyselleştirilmiş ölçme değerlendirme",
    ],
    sortOrder: 4,
    publishedAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: 5,
    slug: "fizyoterapi-duyu-butunleme",
    name: "Fizyoterapi ve Duyu Bütünleme",
    shortDescription:
      "Kaba-ince motor beceriler ve duyu işlemleme güçlükleri için özel donanımlı terapi salonu.",
    description: [
      "Duyu bütünleme salonumuzda denge, koordinasyon ve duyusal düzenleme becerileri desteklenir.",
      "Fizyoterapistlerimiz, ortopedik ve nörogelişimsel değerlendirme sonrası bireysel egzersiz planı hazırlar.",
    ],
    icon: "activity",
    ageRangeLabel: "1-12 yaş",
    sessionFormatLabel: "Bire bir, haftada 1-3 seans",
    highlights: [
      "Duyu bütünleme salonu uygulamaları",
      "Kaba ve ince motor beceri çalışmaları",
      "Denge ve koordinasyon egzersizleri",
      "Duyusal düzenleme stratejileri",
    ],
    sortOrder: 5,
    publishedAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: 6,
    slug: "erken-cocukluk-ozel-egitimi",
    name: "Erken Çocukluk Özel Eğitimi",
    shortDescription:
      "0-6 yaş kritik gelişim döneminde erken tanılama ve erken müdahale programı.",
    description: [
      "Gelişimsel gecikme riski taşıyan bebek ve küçük çocuklar için oyun temelli erken müdahale sunulur.",
      "Aile merkezli yaklaşımla, öğrenilen becerilerin evde sürdürülmesi hedeflenir.",
    ],
    icon: "sprout",
    ageRangeLabel: "0-6 yaş",
    sessionFormatLabel: "Bire bir, haftada 1-3 seans",
    highlights: [
      "Erken gelişimsel tarama ve izlem",
      "Oyun temelli öğrenme oturumları",
      "Aile rehberliği ve ev programı",
      "Okul öncesine geçiş hazırlığı",
    ],
    sortOrder: 6,
    publishedAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: 7,
    slug: "dehb-destek-programi",
    name: "DEHB Destek Programı",
    shortDescription:
      "Dikkat, dürtü kontrolü ve öz düzenleme becerilerini güçlendiren yapılandırılmış çalışmalar.",
    description: [
      "Dikkat eksikliği ve hiperaktivite bozukluğu tanılı çocuklar için dikkat süresi ve öz düzenleme çalışmaları yapılır.",
      "Okul ile iş birliği içinde sınıf içi uyarlama önerileri geliştirilir.",
    ],
    icon: "hand-heart",
    ageRangeLabel: "5-14 yaş",
    sessionFormatLabel: "Bire bir, haftada 1-2 seans",
    highlights: [
      "Dikkat ve odaklanma çalışmaları",
      "Öz düzenleme ve dürtü kontrolü",
      "Organizasyon becerisi desteği",
      "Okul iş birliği ve öneriler",
    ],
    sortOrder: 7,
    publishedAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: 8,
    slug: "aile-danismanligi",
    name: "Aile Danışmanlığı",
    shortDescription:
      "Ailelerin süreci bilinçli ve güçlü bir şekilde yürütmesi için düzenli danışmanlık desteği.",
    description: [
      "Uzman psikologlarımız, aile içi iletişim ve süreç yönetimi konusunda düzenli görüşmeler sunar.",
      "Kardeş desteği ve ebeveyn eğitim atölyeleri de programın bir parçasıdır.",
    ],
    icon: "users",
    ageRangeLabel: "Tüm aile bireyleri",
    sessionFormatLabel: "Bire bir görüşme, aylık planlanır",
    highlights: [
      "Bireysel aile danışmanlığı görüşmeleri",
      "Ebeveyn eğitim atölyeleri",
      "Kardeş destek grupları",
      "Süreç ve hak bilgilendirmesi",
    ],
    sortOrder: 8,
    publishedAt: "2026-01-05T09:00:00.000Z",
  },
];

export const mockPrograms: Program[] = rawPrograms.map((program) => ProgramSchema.parse(program));
