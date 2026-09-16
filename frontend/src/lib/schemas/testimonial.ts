import { z } from "zod";

export const TestimonialSchema = z.object({
  id: z.number().int().positive(),
  parentName: z.string().min(1),
  relationLabel: z.string().min(1),
  quote: z.string().min(1),
  programSlug: z.string().min(1).optional(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;
