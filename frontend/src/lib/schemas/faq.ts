import { z } from "zod";

export const FaqCategorySchema = z.enum(["kayit", "programlar", "gunluk-yasam", "mali-destek"]);
export type FaqCategory = z.infer<typeof FaqCategorySchema>;

export const FaqSchema = z.object({
  id: z.number().int().positive(),
  category: FaqCategorySchema,
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
});
export type Faq = z.infer<typeof FaqSchema>;
