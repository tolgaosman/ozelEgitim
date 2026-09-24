import { z } from "zod";
import { mockPageContent } from "@/mocks/page-content";

/**
 * Laravel `GET /api/page-contents` yanıtının sözleşmesi. Sitedeki her
 * sayfanın hero'su, ana sayfa bölümleri ve SEO başlıkları gibi bugüne kadar
 * TSX dosyalarına gömülü olan metinler artık bu tek uç noktadan gelir.
 *
 * Şekiller backend'deki `App\Support\PageContentBlueprint` ile birebir
 * eşleşmelidir — biri değişirse diğeri de güncellenmelidir. Yeni bir blok
 * eklemek bu dosyaya, `src/mocks/page-content.ts`'e ve backend blueprint'ine
 * paralel eklemeler gerektirir.
 */

const HeroBlockSchema = z.object({
  lead: z.string(),
  accent: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
});

const TitledListItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const HomeHeroSchema = z.object({
  slides: z.array(z.string().min(1)).min(1).max(6),
  announcementBadgeLabel: z.string().min(1),
  leadText: z.string().min(1),
  accentText: z.string().min(1),
  subtitleText: z.string().min(1),
  hashtagText: z.string().min(1),
  ctaLabel: z.string().min(1),
  scrollLabel: z.string().min(1),
});

const HomeIndividualSchema = z.object({
  leadText: z.string().min(1),
  accentText: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().min(1),
  image: z.string().min(1),
});

const HomeDifferenceSchema = z.object({
  leadText: z.string().min(1),
  accentText: z.string().min(1),
  body: z.string().min(1),
  pillars: z.array(TitledListItemSchema).length(3),
});

const HomeProgramsSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  linkLabel: z.string().min(1),
});

const HomeTrajectoriesSchema = z.object({
  leadText: z.string().min(1),
  accentText: z.string().min(1),
});

const HomeCampusSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  linkLabel: z.string().min(1),
  images: z.array(z.string().min(1)).length(4),
});

const HomeAnnouncementsSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  linkLabel: z.string().min(1),
  emptyTitle: z.string().min(1),
  emptyDescription: z.string().min(1),
});

const CtaBandSchema = z.object({
  leadText: z.string().min(1),
  accentText: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().min(1),
});

const AboutStorySchema = z.object({
  leadText: z.string().min(1),
  accentText: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1).max(6),
  image: z.string().min(1),
});

const AboutValuesSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  items: z.array(TitledListItemSchema).min(1).max(6),
});

const ProgramDetailSchema = z.object({
  highlightsTitle: z.string().min(1),
  detailsTitle: z.string().min(1),
  ageLabel: z.string().min(1),
  formatLabel: z.string().min(1),
  ctaLabel: z.string().min(1),
  notFoundTitle: z.string().min(1),
});

const AnnouncementDetailSchema = z.object({
  breadcrumbLead: z.string().min(1),
  breadcrumbAccent: z.string().min(1),
  fallbackImage: z.string().min(1),
  sidebarTitle: z.string().min(1),
  sidebarBody: z.string().min(1),
  sidebarCtaLabel: z.string().min(1),
  otherListTitle: z.string().min(1),
  otherItemCtaLabel: z.string().min(1),
});

const CampusHeroSchema = z.object({
  lead: z.string(),
  accent: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
});

const CampusGallerySchema = z.object({
  images: z.array(z.string().min(1)).length(4),
});

const TitledItemListSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  items: z.array(TitledListItemSchema).min(1).max(6),
});

const ScheduleItemSchema = z.object({
  time: z.string().min(1),
  description: z.string().min(1),
});

const CampusScheduleSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  items: z.array(ScheduleItemSchema).min(1).max(8),
});

const ContactIntroSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  instagramLabel: z.string().min(1),
  facebookLabel: z.string().min(1),
});

const EyebrowTitleDescriptionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const ContactAdmissionStepsSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  steps: z.array(TitledListItemSchema).min(1).max(6),
});

const FooterSchema = z.object({
  tagline: z.string().min(1),
});

const TitleOnlySchema = z.object({
  title: z.string().min(1),
});

const SeoBlockSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const SeoGlobalSchema = z.object({
  defaultTitle: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});

/**
 * Her blok kendi varsayılanına `.catch()` ile düşer: `PageContentBlueprint`
 * güncellenip bu şemaya paralel yansıtılmazsa, ya da DB'deki tek bir kayıt
 * bozuksa, yalnızca O blok yer tutucu içeriğe döner — tüm sayfaların
 * `resolveWithFallback` yüzünden birden yer tutucuya düşmesi engellenir.
 */
export const PageContentSchema = z.object({
  "home.hero": HomeHeroSchema.catch(mockPageContent["home.hero"]),
  "home.individual": HomeIndividualSchema.catch(mockPageContent["home.individual"]),
  "home.difference": HomeDifferenceSchema.catch(mockPageContent["home.difference"]),
  "home.programs_section": HomeProgramsSectionSchema.catch(mockPageContent["home.programs_section"]),
  "home.trajectories": HomeTrajectoriesSchema.catch(mockPageContent["home.trajectories"]),
  "home.campus": HomeCampusSchema.catch(mockPageContent["home.campus"]),
  "home.announcements_section": HomeAnnouncementsSectionSchema.catch(mockPageContent["home.announcements_section"]),
  cta_band: CtaBandSchema.catch(mockPageContent.cta_band),
  "about.hero": HeroBlockSchema.catch(mockPageContent["about.hero"]),
  "about.story": AboutStorySchema.catch(mockPageContent["about.story"]),
  "about.values": AboutValuesSchema.catch(mockPageContent["about.values"]),
  "programs.hero": HeroBlockSchema.catch(mockPageContent["programs.hero"]),
  program_detail: ProgramDetailSchema.catch(mockPageContent.program_detail),
  "announcements.hero": HeroBlockSchema.catch(mockPageContent["announcements.hero"]),
  announcement_detail: AnnouncementDetailSchema.catch(mockPageContent.announcement_detail),
  "staff.hero": HeroBlockSchema.catch(mockPageContent["staff.hero"]),
  "faq.hero": HeroBlockSchema.catch(mockPageContent["faq.hero"]),
  "campus.hero": CampusHeroSchema.catch(mockPageContent["campus.hero"]),
  "campus.gallery": CampusGallerySchema.catch(mockPageContent["campus.gallery"]),
  "campus.facilities": TitledItemListSchema.catch(mockPageContent["campus.facilities"]),
  "campus.schedule": CampusScheduleSchema.catch(mockPageContent["campus.schedule"]),
  "contact.hero": HeroBlockSchema.catch(mockPageContent["contact.hero"]),
  "contact.intro": ContactIntroSchema.catch(mockPageContent["contact.intro"]),
  "contact.form_intro": EyebrowTitleDescriptionSchema.catch(mockPageContent["contact.form_intro"]),
  "contact.admission_steps": ContactAdmissionStepsSchema.catch(mockPageContent["contact.admission_steps"]),
  footer: FooterSchema.catch(mockPageContent.footer),
  "kvkk.page": TitleOnlySchema.catch(mockPageContent["kvkk.page"]),
  "seo.global": SeoGlobalSchema.catch(mockPageContent["seo.global"]),
  "seo.about": SeoBlockSchema.catch(mockPageContent["seo.about"]),
  "seo.programs": SeoBlockSchema.catch(mockPageContent["seo.programs"]),
  "seo.announcements": SeoBlockSchema.catch(mockPageContent["seo.announcements"]),
  "seo.staff": SeoBlockSchema.catch(mockPageContent["seo.staff"]),
  "seo.campus": SeoBlockSchema.catch(mockPageContent["seo.campus"]),
  "seo.faq": SeoBlockSchema.catch(mockPageContent["seo.faq"]),
  "seo.contact": SeoBlockSchema.catch(mockPageContent["seo.contact"]),
  "seo.kvkk": SeoBlockSchema.catch(mockPageContent["seo.kvkk"]),
});

export type PageContent = z.infer<typeof PageContentSchema>;
export type PageContentKey = keyof PageContent;
