import { z } from "zod";

export const AnnouncementCategorySchema = z.enum(["etkinlik", "duyuru", "basari-hikayesi"]);
export type AnnouncementCategory = z.infer<typeof AnnouncementCategorySchema>;

export const AnnouncementSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  category: AnnouncementCategorySchema,
  publishedAt: z.iso.datetime(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;
