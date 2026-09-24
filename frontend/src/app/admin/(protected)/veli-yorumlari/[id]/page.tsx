import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta, AdminTestimonial } from "@/lib/admin/types";

export const metadata = { title: "Yorumu Düzenle" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: testimonial }, { data: meta }] = await Promise.all([
    adminGet<{ data: AdminTestimonial }>(`/api/admin/testimonials/${id}`),
    adminGet<{ data: AdminMeta }>("/api/admin/meta"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yorumu Düzenle</h1>
        <p className="mt-1 text-sm text-ink-soft">{testimonial.parentName}</p>
      </div>
      <TestimonialForm testimonial={testimonial} programs={meta.programs} />
    </div>
  );
}
