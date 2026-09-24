import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Yeni Yorum" };

export default async function NewTestimonialPage() {
  const { data: meta } = await adminGet<{ data: AdminMeta }>("/api/admin/meta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Yorum</h1>
        <p className="mt-1 text-sm text-ink-soft">Yeni bir veli görüşü ekleyin.</p>
      </div>
      <TestimonialForm programs={meta.programs} />
    </div>
  );
}
