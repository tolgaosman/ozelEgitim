import { FaqForm } from "@/components/admin/faqs/faq-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminFaq, AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Soruyu Düzenle" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: faq }, { data: meta }] = await Promise.all([
    adminGet<{ data: AdminFaq }>(`/api/admin/faqs/${id}`),
    adminGet<{ data: AdminMeta }>("/api/admin/meta"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Soruyu Düzenle</h1>
      </div>
      <FaqForm faq={faq} categories={meta.faqCategories} />
    </div>
  );
}
