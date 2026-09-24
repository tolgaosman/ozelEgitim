import { z } from "zod";

/**
 * İletişim / ön görüşme talebi formu doğrulama şeması.
 * `honeypot` alanı bot doldurma girişimlerini yakalamak için gizli
 * tutulur; dolu geldiğinde istek sessizce reddedilir (Rule 03: zero-trust
 * input handling).
 */
export const InquirySchema = z.object({
  parentFullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalıdır.").max(120),
  childAgeLabel: z.string().trim().min(1, "Çocuğunuzun yaşını belirtin.").max(30),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{10,20}$/u, "Geçerli bir telefon numarası girin."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin.").max(160).optional().or(z.literal("")),
  programOfInterest: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  honeypot: z.string().max(0, "Doğrulama başarısız oldu.").optional().or(z.literal("")),
});
export type InquiryInput = z.infer<typeof InquirySchema>;

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof InquiryInput, string>>;
};
