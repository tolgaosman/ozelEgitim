import { z } from "zod";

/**
 * Laravel `GET /api/site-settings` yanıtının sözleşmesi. İletişim bilgileri,
 * çalışma saatleri, KVKK metni ve sayaç kartları tek istekte döner — bu
 * veriler neredeyse her sayfada birlikte kullanılıyor.
 *
 * Bu değerler daha önce `src/lib/seo/constants.ts` ve sayfa bileşenlerinde
 * sabit olarak duruyordu; o dosya silinmedi, backend erişilemediğinde yedek
 * kaynak olarak kullanılmaya devam ediyor (bkz. repositories/site-settings.ts).
 */
export const SiteContactSchema = z.object({
  phoneDisplay: z.string().min(1),
  phoneTel: z.string().min(1),
  whatsappUrl: z.url(),
  email: z.email(),
  address: z.string().min(1),
  mapsUrl: z.url(),
});

export const SiteSocialLinksSchema = z.object({
  instagram: z.url().optional(),
  facebook: z.url().optional(),
  youtube: z.url().optional(),
});

export const SiteOpeningHoursSchema = z.object({
  weekday: z.string().min(1),
  saturday: z.string().min(1),
  sunday: z.string().min(1),
});

export const SiteStatSchema = z.object({
  id: z.number().int().positive(),
  targetValue: z.number().int().nonnegative(),
  suffix: z.string(),
  label: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
});

export const SiteSettingsSchema = z.object({
  contact: SiteContactSchema,
  socialLinks: SiteSocialLinksSchema,
  openingHours: SiteOpeningHoursSchema,
  kvkkBody: z.array(z.string().min(1)).min(1),
  stats: z.array(SiteStatSchema),
});

export type SiteContact = z.infer<typeof SiteContactSchema>;
export type SiteSocialLinks = z.infer<typeof SiteSocialLinksSchema>;
export type SiteOpeningHours = z.infer<typeof SiteOpeningHoursSchema>;
export type SiteStat = z.infer<typeof SiteStatSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
