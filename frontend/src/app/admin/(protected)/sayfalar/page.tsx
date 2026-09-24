import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { pageContentGroups } from "@/lib/admin/page-content-config";

export const metadata = { title: "Sayfa İçerikleri" };

export default function PageContentIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Sayfa İçerikleri</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Sitedeki sayfa başlıkları, açıklamalar ve görseller — düzenlemek istediğiniz sayfayı seçin.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageContentGroups.map((group) => (
          <li key={group.slug}>
            <Link
              href={`/admin/sayfalar/${group.slug}`}
              className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-display text-lg font-bold text-ink">{group.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{group.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-navy-800">
                Düzenle <ChevronRight className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
