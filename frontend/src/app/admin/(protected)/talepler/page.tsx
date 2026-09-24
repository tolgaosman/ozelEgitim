import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminGet } from "@/lib/admin/client";
import type { AdminInquiry } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Ön Görüşme Talepleri" };

const STATUS_TABS = [
  { value: "all", label: "Tümü" },
  { value: "yeni", label: "Yeni" },
  { value: "iletisimde", label: "İletişimde" },
  { value: "tamamlandi", label: "Tamamlandı" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  yeni: "bg-signal/10 text-signal",
  iletisimde: "bg-focus/10 text-focus",
  tamamlandi: "bg-grass-500/15 text-grass-600",
};

const STATUS_LABELS: Record<string, string> = {
  yeni: "Yeni",
  iletisimde: "İletişimde",
  tamamlandi: "Tamamlandı",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status = "all", search = "" } = await searchParams;

  const query = new URLSearchParams();
  if (status !== "all") query.set("status", status);
  if (search) query.set("search", search);

  const { data: inquiries } = await adminGet<{ data: AdminInquiry[] }>(`/api/admin/inquiries?${query.toString()}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Ön Görüşme Talepleri</h1>
        <p className="mt-1 text-sm text-ink-soft">İletişim formundan gelen tüm talepler.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/talepler?status=${tab.value}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors",
                status === tab.value ? "bg-navy-800 text-white" : "bg-white text-ink-soft hover:bg-paper",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <form method="get" className="relative w-full sm:w-64">
          <input type="hidden" name="status" value={status} />
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <Input name="search" defaultValue={search} placeholder="Ad, telefon veya e-posta ara…" className="pl-8" />
        </form>
      </div>

      {inquiries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-ink-soft">
          Bu filtreyle eşleşen talep bulunamadı.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/talepler/${inquiry.id}`}
                className="flex flex-col gap-2 p-4 transition-colors hover:bg-paper/60 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{inquiry.parentFullName}</p>
                  <p className="truncate text-sm text-ink-soft">
                    {inquiry.email ? `${inquiry.phoneNumber} · ${inquiry.email}` : inquiry.phoneNumber}
                  </p>
                </div>
                <p className="text-xs text-ink-faint sm:w-32">{formatDateLabel(inquiry.createdAt)}</p>
                <span className={cn("w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", STATUS_STYLES[inquiry.status])}>
                  {STATUS_LABELS[inquiry.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
