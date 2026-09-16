import { z } from "zod";

/**
 * lucide-react ikon adlarının tamamını içe aktarmak yerine, kartlarda
 * kullanılacak sonlu bir ikon kümesiyle sınırlandırıyoruz. Bu; hem tip
 * güvenliği sağlar hem de tasarımın öngörülemeyen ikonlarla bozulmasını
 * engeller (backend'den gelecek serbest metin bir ikon adını doğrudan
 * bileşene geçirmek güvenli değildir).
 */
export const ProgramIconSchema = z.enum([
  "puzzle",
  "message-circle",
  "brain",
  "activity",
  "sprout",
  "ear",
  "hand-heart",
  "users",
]);
export type ProgramIcon = z.infer<typeof ProgramIconSchema>;

export const ProgramSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.array(z.string().min(1)).min(1),
  icon: ProgramIconSchema,
  ageRangeLabel: z.string().min(1),
  sessionFormatLabel: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1).max(6),
  sortOrder: z.number().int().nonnegative(),
  publishedAt: z.iso.datetime(),
});
export type Program = z.infer<typeof ProgramSchema>;
