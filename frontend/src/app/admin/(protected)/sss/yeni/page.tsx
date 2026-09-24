import { FaqForm } from "@/components/admin/faqs/faq-form";
import { adminGet } from "@/lib/admin/client";
import type { AdminMeta } from "@/lib/admin/types";

export const metadata = { title: "Yeni Soru" };

export default async function NewFaqPage() {
  const { data: meta } = await adminGet<{ data: AdminMeta }>("/api/admin/meta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Soru</h1>
        <p className="mt-1 text-sm text-ink-soft">SSS sayfasına yeni bir soru ekleyin.</p>
      </div>
      <FaqForm categories={meta.faqCategories} />
    </div>
  );
}
