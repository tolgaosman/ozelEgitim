<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Sitedeki her sayfada bugüne kadar `frontend/src` içindeki TSX dosyalarına
 * gömülü olan metin ve görsellerin tek kaynağı. Her anahtar bir "blok"a
 * karşılık gelir (ör. `home.hero`, `about.story`); şekli ve varsayılan
 * değeri burada tanımlıdır.
 *
 * Varsayılan değerler, bu blok panelden hiç düzenlenmeden önce sitenin
 * bugün gösterdiği metinle BİREBİR aynı olmalıdır — aksi halde ilk
 * yayına alma bir içerik değişikliği gibi görünür. Aynı varsayılanların
 * bir kopyası, backend erişilemediğinde kullanılmak üzere
 * `frontend/src/mocks/page-content.ts` içinde de tutulur; biri değişirse
 * diğeri de güncellenmelidir.
 *
 * `GET /api/page-contents` DB'de karşılığı olmayan her anahtar için burada
 * tanımlı varsayılanı döner — bu yüzden yeni bir blok eklemek migration
 * gerektirmez.
 */
final class PageContentBlueprint
{
    /**
     * @return array<string, array{default: mixed, rules: array<string, mixed>}>
     */
    public static function definitions(): array
    {
        return [
            'home.hero' => [
                'default' => [
                    'slides' => [
                        '/images/hero-home.jpg',
                        '/images/campus-1.jpg',
                        '/images/approach.jpg',
                        '/images/testimonial-feature.jpg',
                    ],
                    'announcementBadgeLabel' => 'Duyurular',
                    'leadText' => 'Her çocuğun',
                    'accentText' => 'Kendine Özgü',
                    'subtitleText' => 'bir izi vardır.',
                    'hashtagText' => '#İzFarkı',
                    'ctaLabel' => 'Ücretsiz Ön Görüşme Talep Edin',
                    'scrollLabel' => 'Kaydır',
                ],
                'rules' => [
                    'slides' => ['required', 'array', 'min:1', 'max:6'],
                    'slides.*' => ['required', 'string', 'max:500'],
                    'announcementBadgeLabel' => ['required', 'string', 'max:60'],
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                    'subtitleText' => ['required', 'string', 'max:160'],
                    'hashtagText' => ['required', 'string', 'max:60'],
                    'ctaLabel' => ['required', 'string', 'max:80'],
                    'scrollLabel' => ['required', 'string', 'max:40'],
                ],
            ],

            'home.individual' => [
                'default' => [
                    'leadText' => 'Bireye Özel',
                    'accentText' => 'Program',
                    'body' => "Sektörde tanınan akademik programımız; dil temelli öğrenme farklılıkları ve DEHB'ye odaklanarak, çocukların ve ailelerinin yaşamlarını akademik ve sosyal-duygusal alanda ölçülebilir şekilde dönüştürür.",
                    'ctaLabel' => 'Programlarımızı İnceleyin',
                    'image' => '/images/approach.jpg',
                ],
                'rules' => [
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                    'body' => ['required', 'string', 'max:600'],
                    'ctaLabel' => ['required', 'string', 'max:80'],
                    'image' => ['required', 'string', 'max:500'],
                ],
            ],

            'home.difference' => [
                'default' => [
                    'leadText' => 'Farkı',
                    'accentText' => 'Biliyoruz',
                    'body' => 'Farklı büyüklüğümüz ve yaklaşımımız, her çocuğa hem birey hem öğrenci olarak ulaşmamızı sağlar. İz, öğrencilerimiz ve aileleri için bir okuldan çok daha fazlası — öğrencilerimizin uzun vadeli, bütüncül başarısına yatırım yapan eğitimcilerden, uzmanlardan ve bakım verenlerden oluşan bir topluluktur.',
                    'pillars' => [
                        [
                            'title' => 'Bilime Dayalı, Bireysel Program',
                            'description' => 'Her çocuk için RAM raporu ve klinik değerlendirmeyle şekillenen, düzenli olarak gözden geçirilen bir eğitim planı hazırlıyoruz.',
                        ],
                        [
                            'title' => 'Aileyle Birlikte Yürüyen Süreç',
                            'description' => 'Veliler sürecin bir parçasıdır. Düzenli görüşmeler, ev programları ve atölyelerle öğrenilen becerilerin kalıcılaşmasını sağlıyoruz.',
                        ],
                        [
                            'title' => 'Ölçülebilir, Gözle Görülür İlerleme',
                            'description' => 'İlerleme, her dönem somut gözlem verileriyle paylaşılır; hedefler çocuğun gelişimine göre yeniden şekillenir.',
                        ],
                    ],
                ],
                'rules' => [
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                    'body' => ['required', 'string', 'max:800'],
                    'pillars' => ['required', 'array', 'min:3', 'max:3'],
                    'pillars.*.title' => ['required', 'string', 'max:120'],
                    'pillars.*.description' => ['required', 'string', 'max:400'],
                ],
            ],

            'home.programs_section' => [
                'default' => [
                    'eyebrow' => 'Programlarımız',
                    'title' => 'İhtiyaca özel destek eğitim programları',
                    'description' => 'Her program, RAM raporu ve klinik değerlendirme doğrultusunda bireyselleştirilir.',
                    'linkLabel' => 'Tüm programları görüntüle →',
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'description' => ['required', 'string', 'max:300'],
                    'linkLabel' => ['required', 'string', 'max:60'],
                ],
            ],

            'home.trajectories' => [
                'default' => [
                    'leadText' => 'Hayat Değiştiren',
                    'accentText' => 'Yolculuklar',
                ],
                'rules' => [
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                ],
            ],

            'home.campus' => [
                'default' => [
                    'eyebrow' => 'Merkezimizde Yaşam',
                    'title' => 'Çocuğunuzu her ziyaretinde tanıdık bir ortam karşılar',
                    'linkLabel' => 'Merkezimizi keşfedin →',
                    'images' => [
                        '/images/campus-1.jpg',
                        '/images/campus-2.jpg',
                        '/images/campus-3.jpg',
                        '/images/campus-4.jpg',
                    ],
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:200'],
                    'linkLabel' => ['required', 'string', 'max:60'],
                    'images' => ['required', 'array', 'size:4'],
                    'images.*' => ['required', 'string', 'max:500'],
                ],
            ],

            'home.announcements_section' => [
                'default' => [
                    'eyebrow' => 'Güncel',
                    'title' => 'Duyurular ve Etkinlikler',
                    'linkLabel' => 'Tüm duyuruları görüntüle →',
                    'emptyTitle' => 'Henüz duyuru bulunmuyor',
                    'emptyDescription' => 'Yeni duyurular yayımlandığında burada listelenecektir.',
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'linkLabel' => ['required', 'string', 'max:60'],
                    'emptyTitle' => ['required', 'string', 'max:160'],
                    'emptyDescription' => ['required', 'string', 'max:300'],
                ],
            ],

            'cta_band' => [
                'default' => [
                    'leadText' => 'Doğru Adımı',
                    'accentText' => 'Şimdi Atın',
                    'body' => 'Çocuğunuz için ücretsiz ön görüşme talebinde bulunun; ekibimiz bir hafta içinde sizinle iletişime geçsin.',
                    'ctaLabel' => 'Ön Görüşme Talep Edin',
                ],
                'rules' => [
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                    'body' => ['required', 'string', 'max:400'],
                    'ctaLabel' => ['required', 'string', 'max:80'],
                ],
            ],

            'about.hero' => [
                'default' => [
                    'lead' => 'Bizi Yakından',
                    'accent' => 'TANIYIN',
                    'description' => '18 yıldır özel gereksinimli çocuklara ve ailelerine bilime dayalı, şefkatli bir eğitim ortamı sunuyoruz.',
                    'image' => '/images/hero-about.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'about.story' => [
                'default' => [
                    'leadText' => 'Küçük bir odadan',
                    'accentText' => 'Bugüne',
                    'paragraphs' => [
                        'İz Özel Eğitim Merkezi, 2008 yılında küçük bir odada, tek bir dil ve konuşma terapisti ile yola çıktı. Bugün; özel öğrenme güçlüğünden otizm spektrum bozukluğuna, dil-konuşma güçlüklerinden fizyoterapi ihtiyaçlarına kadar geniş bir yelpazede, alanında uzman bir ekiple hizmet veriyoruz.',
                        'Misyonumuz, her çocuğun kendine özgü potansiyelini keşfetmesine ve mümkün olan en yüksek bağımsızlık düzeyine ulaşmasına destek olmaktır. Bunu yaparken aileleri sürecin dışında değil, tam merkezinde tutarız.',
                    ],
                    'image' => '/images/hero-staff.jpg',
                ],
                'rules' => [
                    'leadText' => ['required', 'string', 'max:120'],
                    'accentText' => ['required', 'string', 'max:120'],
                    'paragraphs' => ['required', 'array', 'min:1', 'max:6'],
                    'paragraphs.*' => ['required', 'string', 'max:800'],
                    'image' => ['required', 'string', 'max:500'],
                ],
            ],

            'about.values' => [
                'default' => [
                    'eyebrow' => 'Değerlerimiz',
                    'title' => 'Bizi biz yapan ilkeler',
                    'items' => [
                        ['title' => 'Şefkat ve Saygı', 'description' => 'Her çocuğa ve aileye, bireyselliğine saygı duyarak, yargılamadan yaklaşırız.'],
                        ['title' => 'Bilimsel Güvenilirlik', 'description' => 'Uygulamalarımız güncel özel eğitim ve klinik psikoloji literatürüne dayanır.'],
                        ['title' => 'Hedef Odaklılık', 'description' => 'Her program, ölçülebilir ve çocuğun yaşam kalitesini artıran hedefler üzerine kurulur.'],
                        ['title' => 'Sürekli Gelişim', 'description' => 'Ekibimiz düzenli hizmet içi eğitimlerle güncel yöntemleri takip eder.'],
                    ],
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'items' => ['required', 'array', 'min:1', 'max:6'],
                    'items.*.title' => ['required', 'string', 'max:120'],
                    'items.*.description' => ['required', 'string', 'max:300'],
                ],
            ],

            'programs.hero' => [
                'default' => [
                    'lead' => 'Destek Eğitim',
                    'accent' => 'PROGRAMLARIMIZ',
                    'description' => 'Her program, RAM raporu ve klinik değerlendirme doğrultusunda çocuğunuza özel olarak planlanır.',
                    'image' => '/images/hero-programs.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'program_detail' => [
                'default' => [
                    'highlightsTitle' => 'Programın Öne Çıkan Özellikleri',
                    'detailsTitle' => 'Program Detayları',
                    'ageLabel' => 'Yaş Aralığı',
                    'formatLabel' => 'Seans Formatı',
                    'ctaLabel' => 'Ön Görüşme Talep Edin',
                    'notFoundTitle' => 'Program Bulunamadı',
                ],
                'rules' => [
                    'highlightsTitle' => ['required', 'string', 'max:120'],
                    'detailsTitle' => ['required', 'string', 'max:120'],
                    'ageLabel' => ['required', 'string', 'max:60'],
                    'formatLabel' => ['required', 'string', 'max:60'],
                    'ctaLabel' => ['required', 'string', 'max:80'],
                    'notFoundTitle' => ['required', 'string', 'max:120'],
                ],
            ],

            'announcements.hero' => [
                'default' => [
                    'lead' => 'Duyurular ve',
                    'accent' => 'ETKİNLİKLER',
                    'description' => 'Kayıt dönemleri, etkinlikler ve merkezimizdeki gelişmelerden haberdar olun.',
                    'image' => '/images/hero-admissions.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'announcement_detail' => [
                'default' => [
                    'breadcrumbLead' => 'Duyuru /',
                    'breadcrumbAccent' => 'ETKİNLİK',
                    'fallbackImage' => '/images/hero-home.jpg',
                    'sidebarTitle' => 'Daha fazla bilgi mi gerekiyor?',
                    'sidebarBody' => 'Bu konu veya merkezimizdeki programlar hakkında detaylı bilgi almak için bize ulaşabilirsiniz.',
                    'sidebarCtaLabel' => 'İletişime Geçin',
                    'otherListTitle' => 'Diğer Duyurular',
                    'otherItemCtaLabel' => 'İncele',
                ],
                'rules' => [
                    'breadcrumbLead' => ['required', 'string', 'max:60'],
                    'breadcrumbAccent' => ['required', 'string', 'max:60'],
                    'fallbackImage' => ['required', 'string', 'max:500'],
                    'sidebarTitle' => ['required', 'string', 'max:160'],
                    'sidebarBody' => ['required', 'string', 'max:400'],
                    'sidebarCtaLabel' => ['required', 'string', 'max:80'],
                    'otherListTitle' => ['required', 'string', 'max:120'],
                    'otherItemCtaLabel' => ['required', 'string', 'max:60'],
                ],
            ],

            'staff.hero' => [
                'default' => [
                    'lead' => 'Uzman',
                    'accent' => 'KADROMUZ',
                    'description' => 'Alanında uzman, deneyimli ve şefkatli bir ekiple çocuğunuzun yanındayız.',
                    'image' => '/images/hero-staff.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'faq.hero' => [
                'default' => [
                    'lead' => 'Sıkça Sorulan',
                    'accent' => 'SORULAR',
                    'description' => 'Merak ettiklerinizin çoğu burada. Aradığınızı bulamazsanız bizimle iletişime geçmekten çekinmeyin.',
                    'image' => '/images/hero-contact.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'campus.hero' => [
                'default' => [
                    'lead' => '',
                    'accent' => 'MERKEZİMİZ',
                    'description' => 'Çocuğunuzu her ziyaretinde tanıdık, sakin ve güven veren bir ortam karşılar.',
                    'image' => '/images/hero-life.jpg',
                ],
                'rules' => [
                    'lead' => ['nullable', 'string', 'max:120'],
                    'accent' => ['required', 'string', 'max:120'],
                    'description' => ['required', 'string', 'max:300'],
                    'image' => ['required', 'string', 'max:500'],
                ],
            ],

            'campus.gallery' => [
                'default' => [
                    'images' => [
                        '/images/campus-1.jpg',
                        '/images/campus-2.jpg',
                        '/images/campus-3.jpg',
                        '/images/campus-4.jpg',
                    ],
                ],
                'rules' => [
                    'images' => ['required', 'array', 'size:4'],
                    'images.*' => ['required', 'string', 'max:500'],
                ],
            ],

            'campus.facilities' => [
                'default' => [
                    'eyebrow' => 'Mekanlarımız',
                    'title' => 'Her alan, bir amaca hizmet eder',
                    'items' => [
                        ['title' => 'Duyu Bütünleme Salonu', 'description' => 'Salıncak, denge tahtası ve dokunsal materyallerle donatılmış geniş bir terapi alanı.'],
                        ['title' => 'Bireysel Çalışma Odaları', 'description' => 'Dikkat dağıtıcı unsurlardan arındırılmış, sakin ışıklandırmalı bire bir eğitim odaları.'],
                        ['title' => 'Sosyal Beceri Atölyesi', 'description' => 'Küçük grup çalışmaları için tasarlanmış, oyun temelli etkileşim alanı.'],
                        ['title' => 'Duyusal Bahçe', 'description' => 'Açık hava molaları için güvenli, çitlerle çevrili yeşil alan.'],
                    ],
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'items' => ['required', 'array', 'min:1', 'max:6'],
                    'items.*.title' => ['required', 'string', 'max:120'],
                    'items.*.description' => ['required', 'string', 'max:300'],
                ],
            ],

            'campus.schedule' => [
                'default' => [
                    'eyebrow' => 'Öngörülebilirlik',
                    'title' => 'Örnek bir gün akışı',
                    'items' => [
                        ['time' => '09:00', 'description' => 'Sakin karşılama ve günün akış kartlarıyla tanışma'],
                        ['time' => '09:30', 'description' => 'Bireysel eğitim seansları (dil, akademik veya duyu bütünleme)'],
                        ['time' => '11:00', 'description' => 'Kısa mola ve duyusal bahçede serbest oyun'],
                        ['time' => '11:30', 'description' => 'Sosyal beceri atölyesi veya grup etkinliği'],
                        ['time' => '12:30', 'description' => 'Aile ile gün sonu bilgilendirmesi'],
                    ],
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'items' => ['required', 'array', 'min:1', 'max:8'],
                    'items.*.time' => ['required', 'string', 'max:20'],
                    'items.*.description' => ['required', 'string', 'max:300'],
                ],
            ],

            'contact.hero' => [
                'default' => [
                    'lead' => 'İletişim ve',
                    'accent' => 'BAŞVURU',
                    'description' => 'Süreç, göründüğünden daha kolay. Size dört adımda rehberlik ediyoruz.',
                    'image' => '/images/hero-admissions.jpg',
                ],
                'rules' => self::heroRules(),
            ],

            'contact.intro' => [
                'default' => [
                    'title' => 'İlk adımı birlikte atalım',
                    'description' => 'Bize aşağıdaki kanallardan doğrudan ulaşabilirsiniz.',
                    'instagramLabel' => '@iz_ozel_rehabilitasyon',
                    'facebookLabel' => 'İz Özel Eğitim',
                ],
                'rules' => [
                    'title' => ['required', 'string', 'max:160'],
                    'description' => ['required', 'string', 'max:300'],
                    'instagramLabel' => ['required', 'string', 'max:80'],
                    'facebookLabel' => ['required', 'string', 'max:80'],
                ],
            ],

            'contact.form_intro' => [
                'default' => [
                    'eyebrow' => 'Ön Görüşme',
                    'title' => 'Bize ulaşın',
                    'description' => 'Formu doldurun; ekibimiz kısa süre içinde sizi arayarak uygun bir görüşme zamanı planlasın.',
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:120'],
                    'description' => ['required', 'string', 'max:300'],
                ],
            ],

            'contact.admission_steps' => [
                'default' => [
                    'eyebrow' => 'Süreç',
                    'title' => 'Kayıt nasıl ilerler?',
                    'steps' => [
                        [
                            'title' => 'Ön Görüşme Formunu Doldurun',
                            'description' => 'Bu sayfadaki formu doldurarak çocuğunuz hakkında temel bilgileri bizimle paylaşın. Ekibimiz bir hafta içinde sizinle iletişime geçer.',
                        ],
                        [
                            'title' => 'RAM Raporunuzu İletin',
                            'description' => 'Güncel RAM raporunuz varsa süreç hızlanır. Raporunuz yoksa RAM başvurusu için size adım adım rehberlik ediyoruz.',
                        ],
                        [
                            'title' => 'Değerlendirme Görüşmesi',
                            'description' => 'Uzman ekibimiz çocuğunuzla tanışır, güçlü yönlerini ve ihtiyaçlarını birlikte belirleriz.',
                        ],
                        [
                            'title' => 'Bireyselleştirilmiş Programla Başlayın',
                            'description' => 'Çocuğunuza özel hazırlanan eğitim programı onaylanır ve seans takvimi birlikte planlanır.',
                        ],
                    ],
                ],
                'rules' => [
                    'eyebrow' => ['required', 'string', 'max:60'],
                    'title' => ['required', 'string', 'max:160'],
                    'steps' => ['required', 'array', 'min:1', 'max:6'],
                    'steps.*.title' => ['required', 'string', 'max:120'],
                    'steps.*.description' => ['required', 'string', 'max:400'],
                ],
            ],

            'footer' => [
                'default' => [
                    'tagline' => 'Her çocuğun kendine özgü bir öğrenme yolculuğu vardır. Biz bu yolculukta ailelerin yanında, bilime dayalı ve şefkatli bir eğitim ortamı sunarız.',
                ],
                'rules' => [
                    'tagline' => ['required', 'string', 'max:400'],
                ],
            ],

            'kvkk.page' => [
                'default' => [
                    'title' => 'KVKK Aydınlatma Metni',
                ],
                'rules' => [
                    'title' => ['required', 'string', 'max:160'],
                ],
            ],

            'seo.global' => [
                'default' => [
                    'defaultTitle' => 'İz Özel Eğitim Merkezi — Özel Eğitim ve Rehabilitasyon Merkezi',
                    'description' => 'İz Özel Eğitim Merkezi; otizm spektrum bozukluğu, özel öğrenme güçlüğü, dil-konuşma ve gelişimsel destek ihtiyacı olan çocuklar için bireyselleştirilmiş eğitim programları sunar.',
                    'keywords' => [
                        'özel eğitim merkezi',
                        'otizm destek eğitimi',
                        'dil ve konuşma terapisi',
                        'özel öğrenme güçlüğü',
                        'RAM raporu',
                        'duyu bütünleme terapisi',
                    ],
                ],
                'rules' => [
                    'defaultTitle' => ['required', 'string', 'max:160'],
                    'description' => ['required', 'string', 'max:300'],
                    'keywords' => ['required', 'array', 'min:1', 'max:15'],
                    'keywords.*' => ['required', 'string', 'max:60'],
                ],
            ],

            'seo.about' => self::seoDefinition(
                'Hakkımızda',
                "İz Özel Eğitim Merkezi'nin kuruluş hikayesi, misyonu ve eğitim felsefesi hakkında bilgi alın.",
            ),
            'seo.programs' => self::seoDefinition(
                'Programlarımız',
                "Özel öğrenme güçlüğü, dil ve konuşma terapisi, otizm spektrum destek programı ve daha fazlası — İz Özel Eğitim Merkezi'nin destek eğitim programlarını inceleyin.",
            ),
            'seo.announcements' => self::seoDefinition(
                'Duyurular',
                "İz Özel Eğitim Merkezi'nden güncel duyurular ve etkinlikler.",
            ),
            'seo.staff' => self::seoDefinition(
                'Kadromuz',
                "İz Özel Eğitim Merkezi'nin özel eğitim uzmanları, dil ve konuşma terapistleri, ABA uzmanları ve fizyoterapistlerini tanıyın.",
            ),
            'seo.campus' => self::seoDefinition(
                'Merkezimiz',
                "İz Özel Eğitim Merkezi'nde çocuğunuzu bekleyen sakin, güvenli ve destekleyici ortamı keşfedin.",
            ),
            'seo.faq' => self::seoDefinition(
                'Sıkça Sorulan Sorular',
                'Kayıt süreci, programlar, günlük yaşam ve mali destek hakkında sık sorulan sorular.',
            ),
            'seo.contact' => self::seoDefinition(
                'İletişim ve Başvuru',
                'İz Özel Eğitim Merkezi ile iletişime geçin, adres ve çalışma saatlerimizi öğrenin, kayıt başvuru formunu doldurun.',
            ),
            'seo.kvkk' => self::seoDefinition(
                'KVKK Aydınlatma Metni',
                '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
            ),
        ];
    }

    /** @return array<string, array{default: mixed, rules: array<string, mixed>}> */
    public static function keys(): array
    {
        return array_keys(self::definitions());
    }

    public static function exists(string $key): bool
    {
        return array_key_exists($key, self::definitions());
    }

    /** @return array<string, mixed>|null */
    public static function defaultFor(string $key): ?array
    {
        return self::definitions()[$key]['default'] ?? null;
    }

    /** @return array<string, mixed>|null */
    public static function rulesFor(string $key): ?array
    {
        return self::definitions()[$key]['rules'] ?? null;
    }

    /** Tüm bloklar için: DB satırı varsa onu, yoksa varsayılanı döner. */
    public static function defaults(): array
    {
        return array_map(
            static fn (array $definition): array => $definition['default'],
            self::definitions(),
        );
    }

    /** @return array<string, string> Blok anahtarı => tekil görsel alanının adı. */
    public static function imageFields(): array
    {
        return [
            'home.individual' => 'image',
            'about.hero' => 'image',
            'about.story' => 'image',
            'programs.hero' => 'image',
            'announcements.hero' => 'image',
            'announcement_detail' => 'fallbackImage',
            'staff.hero' => 'image',
            'faq.hero' => 'image',
            'campus.hero' => 'image',
            'contact.hero' => 'image',
        ];
    }

    /** @return array<string, string> Blok anahtarı => görsel listesi alanının adı. */
    public static function imageListFields(): array
    {
        return [
            'home.hero' => 'slides',
            'home.campus' => 'images',
            'campus.gallery' => 'images',
        ];
    }

    /**
     * `GET /api/page-contents` yanıtından önce çağrılır: panelden yüklenmiş
     * göreli storage yollarını mutlak URL'e çevirir (bkz. `MediaUrl::resolvePageContentValue`).
     *
     * @param  array<string, mixed>  $blocks
     * @return array<string, mixed>
     */
    public static function resolveImageUrls(array $blocks): array
    {
        foreach (self::imageFields() as $blockKey => $fieldKey) {
            if (isset($blocks[$blockKey][$fieldKey]) && is_string($blocks[$blockKey][$fieldKey])) {
                $blocks[$blockKey][$fieldKey] = MediaUrl::resolvePageContentValue($blocks[$blockKey][$fieldKey]);
            }
        }

        foreach (self::imageListFields() as $blockKey => $fieldKey) {
            if (isset($blocks[$blockKey][$fieldKey]) && is_array($blocks[$blockKey][$fieldKey])) {
                $blocks[$blockKey][$fieldKey] = array_map(
                    static fn (mixed $value): mixed => is_string($value) ? MediaUrl::resolvePageContentValue($value) : $value,
                    $blocks[$blockKey][$fieldKey],
                );
            }
        }

        return $blocks;
    }

    /** @return array<string, mixed> */
    private static function heroRules(): array
    {
        return [
            'lead' => ['required', 'string', 'max:120'],
            'accent' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:300'],
            'image' => ['required', 'string', 'max:500'],
        ];
    }

    /** @return array{default: array{title: string, description: string}, rules: array<string, mixed>} */
    private static function seoDefinition(string $title, string $description): array
    {
        return [
            'default' => ['title' => $title, 'description' => $description],
            'rules' => [
                'title' => ['required', 'string', 'max:160'],
                'description' => ['required', 'string', 'max:300'],
            ],
        ];
    }
}
