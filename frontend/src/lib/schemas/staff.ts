import { z } from "zod";

export const StaffMemberSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  fullName: z.string().min(1),
  title: z.string().min(1),
  specialties: z.array(z.string().min(1)).min(1).max(5),
  bio: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
});
export type StaffMember = z.infer<typeof StaffMemberSchema>;
