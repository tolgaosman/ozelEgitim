/**
 * Backend erişilemediğinde kullanılan yer tutucu. Değerler
 * `backend/app/Support/PageContentBlueprint.php` içindeki varsayılanlarla
 * BİREBİR aynı olmalıdır — biri değişirse diğeri de güncellenmelidir.
 *
 * Kasıtlı olarak `PageContent` tipiyle açıkça işaretlenmez: bu tip
 * `lib/schemas/page-content.ts`teki şemadan türetilir ve o şema, tek bir
 * hatalı bloğun tüm sayfayı yer tutucuya düşürmesini önlemek için bu
 * sabitin kendisini "varsayılan" olarak kullanır. Açık tip burada döngüsel
 * bir tip bağımlılığı oluşturur; yapısal tip denetimi zaten şema ile bu
 * sabitin birbirinden sapmasını (derleme zamanında) yakalamaya yeter.
 */
export const mockPageContent = {
  "home.hero": {
    slides: [
      "/images/hero-home.jpg",
      "/images/campus-1.jpg",
      "/images/approach.jpg",
      "/images/testimonial-feature.jpg",
    ],
    announcementBadgeLabel: "Duyurular",
    leadText: "Her çocuğun",
    accentText: "Kendine Özgü",
    subtitleText: "bir izi vardır.",
    hashtagText: "#İzFarkı",
    ctaLabel: "Ücretsiz Ön Görüşme Talep Edin",
    scrollLabel: "Kaydır",
  },
  "home.individual": {
    leadText: "Bireye Özel",
    accentText: "Program",
    body: "Sektörde tanınan akademik programımız; dil temelli öğrenme farklılıkları ve DEHB'ye odaklanarak, çocukların ve ailelerinin yaşamlarını akademik ve sosyal-duygusal alanda ölçülebilir şekilde dönüştürür.",
    ctaLabel: "Programlarımızı İnceleyin",
    image: "/images/approach.jpg",
  },
  "home.difference": {
    leadText: "Farkı",
    accentText: "Biliyoruz",
    body: "Farklı büyüklüğümüz ve yaklaşımımız, her çocuğa hem birey hem öğrenci olarak ulaşmamızı sağlar. İz, öğrencilerimiz ve aileleri için bir okuldan çok daha fazlası — öğrencilerimizin uzun vadeli, bütüncül başarısına yatırım yapan eğitimcilerden, uzmanlardan ve bakım verenlerden oluşan bir topluluktur.",
    pillars: [
      {
        title: "Bilime Dayalı, Bireysel Program",
        description:
          "Her çocuk için RAM raporu ve klinik değerlendirmeyle şekillenen, düzenli olarak gözden geçirilen bir eğitim planı hazırlıyoruz.",
      },
      {
        title: "Aileyle Birlikte Yürüyen Süreç",
        description:
          "Veliler sürecin bir parçasıdır. Düzenli görüşmeler, ev programları ve atölyelerle öğrenilen becerilerin kalıcılaşmasını sağlıyoruz.",
      },
      {
        title: "Ölçülebilir, Gözle Görülür İlerleme",
        description:
          "İlerleme, her dönem somut gözlem verileriyle paylaşılır; hedefler çocuğun gelişimine göre yeniden şekillenir.",
      },
    ],
  },
  "home.programs_section": {
    eyebrow: "Programlarımız",
    title: "İhtiyaca özel destek eğitim programları",
    description: "Her program, RAM raporu ve klinik değerlendirme doğrultusunda bireyselleştirilir.",
    linkLabel: "Tüm programları görüntüle →",
  },
  "home.trajectories": {
    leadText: "Hayat Değiştiren",
    accentText: "Yolculuklar",
  },
  "home.campus": {
    eyebrow: "Merkezimizde Yaşam",
    title: "Çocuğunuzu her ziyaretinde tanıdık bir ortam karşılar",
    linkLabel: "Merkezimizi keşfedin →",
    images: ["/images/campus-1.jpg", "/images/campus-2.jpg", "/images/campus-3.jpg", "/images/campus-4.jpg"],
  },
  "home.announcements_section": {
    eyebrow: "Güncel",
    title: "Duyurular ve Etkinlikler",
    linkLabel: "Tüm duyuruları görüntüle →",
    emptyTitle: "Henüz duyuru bulunmuyor",
    emptyDescription: "Yeni duyurular yayımlandığında burada listelenecektir.",
  },
  cta_band: {
    leadText: "Doğru Adımı",
    accentText: "Şimdi Atın",
    body: "Çocuğunuz için ücretsiz ön görüşme talebinde bulunun; ekibimiz bir hafta içinde sizinle iletişime geçsin.",
    ctaLabel: "Ön Görüşme Talep Edin",
  },
  "about.hero": {
    lead: "Bizi Yakından",
    accent: "TANIYIN",
    description: "18 yıldır özel gereksinimli çocuklara ve ailelerine bilime dayalı, şefkatli bir eğitim ortamı sunuyoruz.",
    image: "/images/hero-about.jpg",
  },
  "about.story": {
    leadText: "Küçük bir odadan",
    accentText: "Bugüne",
    paragraphs: [
      "İz Özel Eğitim Merkezi, 2008 yılında küçük bir odada, tek bir dil ve konuşma terapisti ile yola çıktı. Bugün; özel öğrenme güçlüğünden otizm spektrum bozukluğuna, dil-konuşma güçlüklerinden fizyoterapi ihtiyaçlarına kadar geniş bir yelpazede, alanında uzman bir ekiple hizmet veriyoruz.",
      "Misyonumuz, her çocuğun kendine özgü potansiyelini keşfetmesine ve mümkün olan en yüksek bağımsızlık düzeyine ulaşmasına destek olmaktır. Bunu yaparken aileleri sürecin dışında değil, tam merkezinde tutarız.",
    ],
    image: "/images/hero-staff.jpg",
  },
  "about.values": {
    eyebrow: "Değerlerimiz",
    title: "Bizi biz yapan ilkeler",
    items: [
      { title: "Şefkat ve Saygı", description: "Her çocuğa ve aileye, bireyselliğine saygı duyarak, yargılamadan yaklaşırız." },
      { title: "Bilimsel Güvenilirlik", description: "Uygulamalarımız güncel özel eğitim ve klinik psikoloji literatürüne dayanır." },
      { title: "Hedef Odaklılık", description: "Her program, ölçülebilir ve çocuğun yaşam kalitesini artıran hedefler üzerine kurulur." },
      { title: "Sürekli Gelişim", description: "Ekibimiz düzenli hizmet içi eğitimlerle güncel yöntemleri takip eder." },
    ],
  },
  "programs.hero": {
    lead: "Destek Eğitim",
    accent: "PROGRAMLARIMIZ",
    description: "Her program, RAM raporu ve klinik değerlendirme doğrultusunda çocuğunuza özel olarak planlanır.",
    image: "/images/hero-programs.jpg",
  },
  program_detail: {
    highlightsTitle: "Programın Öne Çıkan Özellikleri",
    detailsTitle: "Program Detayları",
    ageLabel: "Yaş Aralığı",
    formatLabel: "Seans Formatı",
    ctaLabel: "Ön Görüşme Talep Edin",
    notFoundTitle: "Program Bulunamadı",
  },
  "announcements.hero": {
    lead: "Duyurular ve",
    accent: "ETKİNLİKLER",
    description: "Kayıt dönemleri, etkinlikler ve merkezimizdeki gelişmelerden haberdar olun.",
    image: "/images/hero-admissions.jpg",
  },
  announcement_detail: {
    breadcrumbLead: "Duyuru /",
    breadcrumbAccent: "ETKİNLİK",
    fallbackImage: "/images/hero-home.jpg",
    sidebarTitle: "Daha fazla bilgi mi gerekiyor?",
    sidebarBody: "Bu konu veya merkezimizdeki programlar hakkında detaylı bilgi almak için bize ulaşabilirsiniz.",
    sidebarCtaLabel: "İletişime Geçin",
    otherListTitle: "Diğer Duyurular",
    otherItemCtaLabel: "İncele",
  },
  "staff.hero": {
    lead: "Uzman",
    accent: "KADROMUZ",
    description: "Alanında uzman, deneyimli ve şefkatli bir ekiple çocuğunuzun yanındayız.",
    image: "/images/hero-staff.jpg",
  },
  "faq.hero": {
    lead: "Sıkça Sorulan",
    accent: "SORULAR",
    description: "Merak ettiklerinizin çoğu burada. Aradığınızı bulamazsanız bizimle iletişime geçmekten çekinmeyin.",
    image: "/images/hero-contact.jpg",
  },
  "campus.hero": {
    lead: "",
    accent: "MERKEZİMİZ",
    description: "Çocuğunuzu her ziyaretinde tanıdık, sakin ve güven veren bir ortam karşılar.",
    image: "/images/hero-life.jpg",
  },
  "campus.gallery": {
    images: ["/images/campus-1.jpg", "/images/campus-2.jpg", "/images/campus-3.jpg", "/images/campus-4.jpg"],
  },
  "campus.facilities": {
    eyebrow: "Mekanlarımız",
    title: "Her alan, bir amaca hizmet eder",
    items: [
      { title: "Duyu Bütünleme Salonu", description: "Salıncak, denge tahtası ve dokunsal materyallerle donatılmış geniş bir terapi alanı." },
      { title: "Bireysel Çalışma Odaları", description: "Dikkat dağıtıcı unsurlardan arındırılmış, sakin ışıklandırmalı bire bir eğitim odaları." },
      { title: "Sosyal Beceri Atölyesi", description: "Küçük grup çalışmaları için tasarlanmış, oyun temelli etkileşim alanı." },
      { title: "Duyusal Bahçe", description: "Açık hava molaları için güvenli, çitlerle çevrili yeşil alan." },
    ],
  },
  "campus.schedule": {
    eyebrow: "Öngörülebilirlik",
    title: "Örnek bir gün akışı",
    items: [
      { time: "09:00", description: "Sakin karşılama ve günün akış kartlarıyla tanışma" },
      { time: "09:30", description: "Bireysel eğitim seansları (dil, akademik veya duyu bütünleme)" },
      { time: "11:00", description: "Kısa mola ve duyusal bahçede serbest oyun" },
      { time: "11:30", description: "Sosyal beceri atölyesi veya grup etkinliği" },
      { time: "12:30", description: "Aile ile gün sonu bilgilendirmesi" },
    ],
  },
  "contact.hero": {
    lead: "İletişim ve",
    accent: "BAŞVURU",
    description: "Süreç, göründüğünden daha kolay. Size dört adımda rehberlik ediyoruz.",
    image: "/images/hero-admissions.jpg",
  },
  "contact.intro": {
    title: "İlk adımı birlikte atalım",
    description: "Bize aşağıdaki kanallardan doğrudan ulaşabilirsiniz.",
    instagramLabel: "@iz_ozel_rehabilitasyon",
    facebookLabel: "İz Özel Eğitim",
  },
  "contact.form_intro": {
    eyebrow: "Ön Görüşme",
    title: "Bize ulaşın",
    description: "Formu doldurun; ekibimiz kısa süre içinde sizi arayarak uygun bir görüşme zamanı planlasın.",
  },
  "contact.admission_steps": {
    eyebrow: "Süreç",
    title: "Kayıt nasıl ilerler?",
    steps: [
      {
        title: "Ön Görüşme Formunu Doldurun",
        description:
          "Bu sayfadaki formu doldurarak çocuğunuz hakkında temel bilgileri bizimle paylaşın. Ekibimiz bir hafta içinde sizinle iletişime geçer.",
      },
      {
        title: "RAM Raporunuzu İletin",
        description: "Güncel RAM raporunuz varsa süreç hızlanır. Raporunuz yoksa RAM başvurusu için size adım adım rehberlik ediyoruz.",
      },
      {
        title: "Değerlendirme Görüşmesi",
        description: "Uzman ekibimiz çocuğunuzla tanışır, güçlü yönlerini ve ihtiyaçlarını birlikte belirleriz.",
      },
      {
        title: "Bireyselleştirilmiş Programla Başlayın",
        description: "Çocuğunuza özel hazırlanan eğitim programı onaylanır ve seans takvimi birlikte planlanır.",
      },
    ],
  },
  footer: {
    tagline:
      "Her çocuğun kendine özgü bir öğrenme yolculuğu vardır. Biz bu yolculukta ailelerin yanında, bilime dayalı ve şefkatli bir eğitim ortamı sunarız.",
  },
  "kvkk.page": {
    title: "KVKK Aydınlatma Metni",
  },
  "seo.global": {
    defaultTitle: "İz Özel Eğitim Merkezi — Özel Eğitim ve Rehabilitasyon Merkezi",
    description:
      "İz Özel Eğitim Merkezi; otizm spektrum bozukluğu, özel öğrenme güçlüğü, dil-konuşma ve gelişimsel destek ihtiyacı olan çocuklar için bireyselleştirilmiş eğitim programları sunar.",
    keywords: [
      "özel eğitim merkezi",
      "otizm destek eğitimi",
      "dil ve konuşma terapisi",
      "özel öğrenme güçlüğü",
      "RAM raporu",
      "duyu bütünleme terapisi",
    ],
  },
  "seo.about": {
    title: "Hakkımızda",
    description: "İz Özel Eğitim Merkezi'nin kuruluş hikayesi, misyonu ve eğitim felsefesi hakkında bilgi alın.",
  },
  "seo.programs": {
    title: "Programlarımız",
    description:
      "Özel öğrenme güçlüğü, dil ve konuşma terapisi, otizm spektrum destek programı ve daha fazlası — İz Özel Eğitim Merkezi'nin destek eğitim programlarını inceleyin.",
  },
  "seo.announcements": {
    title: "Duyurular",
    description: "İz Özel Eğitim Merkezi'nden güncel duyurular ve etkinlikler.",
  },
  "seo.staff": {
    title: "Kadromuz",
    description:
      "İz Özel Eğitim Merkezi'nin özel eğitim uzmanları, dil ve konuşma terapistleri, ABA uzmanları ve fizyoterapistlerini tanıyın.",
  },
  "seo.campus": {
    title: "Merkezimiz",
    description: "İz Özel Eğitim Merkezi'nde çocuğunuzu bekleyen sakin, güvenli ve destekleyici ortamı keşfedin.",
  },
  "seo.faq": {
    title: "Sıkça Sorulan Sorular",
    description: "Kayıt süreci, programlar, günlük yaşam ve mali destek hakkında sık sorulan sorular.",
  },
  "seo.contact": {
    title: "İletişim ve Başvuru",
    description: "İz Özel Eğitim Merkezi ile iletişime geçin, adres ve çalışma saatlerimizi öğrenin, kayıt başvuru formunu doldurun.",
  },
  "seo.kvkk": {
    title: "KVKK Aydınlatma Metni",
    description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
  },
};
