import Link from "next/link";
import { ExternalLink, FileText, Inbox, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { adminGet } from "@/lib/admin/client";
import type { DashboardSummary } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";

const TURKISH_DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export const metadata = { title: "Panel" };

type DashboardResponse = { data: DashboardSummary };

const STATUS_LABELS: Record<string, string> = {
  yeni: "Yeni",
  iletisimde: "İletişimde",
  tamamlandi: "Tamamlandı",
};

const STATUS_STYLES: Record<string, string> = {
  yeni: "bg-signal/10 text-signal",
  iletisimde: "bg-focus/10 text-focus",
  tamamlandi: "bg-grass-500/15 text-grass-600",
};

function SummaryCard({
  href,
  label,
  value,
  icon: Icon,
  highlight,
}: {
  href: string;
  label: string;
  value: number;
  icon: typeof Inbox;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
        highlight ? "border-signal/30 bg-signal/5" : "border-border bg-white"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          highlight ? "bg-signal/15 text-signal" : "bg-aqua-100 text-navy-800"
        }`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
        <p className="text-sm font-medium text-ink-soft">{label}</p>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { data } = await adminGet<DashboardResponse>("/api/admin/dashboard");

  const todayLabel = TURKISH_DATE_FORMATTER.format(new Date());

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 sm:p-8">
        <ShapeField>
          <Shape color="aqua" form="circle" scale={0.55} blend className="-top-12 right-[10%]" />
        </ShapeField>
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">{todayLabel}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Hoş geldiniz</h1>
          <p className="mt-1.5 max-w-lg text-sm text-white/70">Sitenizin güncel durumuna genel bir bakış.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard href="/admin/talepler" label="Yeni Ön Görüşme Talebi" value={data.counts.newInquiries} icon={Inbox} highlight />
        <SummaryCard href="/admin/programlar" label="Program" value={data.counts.programs} icon={Sparkles} />
        <SummaryCard href="/admin/duyurular" label="Duyuru" value={data.counts.announcements} icon={FileText} />
        <SummaryCard href="/admin/kadro" label="Kadro Üyesi" value={data.counts.staffMembers} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Son Ön Görüşme Talepleri</h2>
            <Link href="/admin/talepler" className="text-sm font-bold text-navy-800 hover:underline">
              Tümünü gör →
            </Link>
          </div>

          {data.recentInquiries.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft">Henüz talep bulunmuyor.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {data.recentInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/admin/talepler/${inquiry.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-paper/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{inquiry.parentFullName}</p>
                      <p className="truncate text-xs text-ink-soft">
                        {inquiry.phoneNumber} · {formatDateLabel(inquiry.createdAt)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[inquiry.status]}`}>
                      {STATUS_LABELS[inquiry.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-lg font-bold text-ink">Hızlı İşlemler</h2>
          <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/duyurular/yeni" />}>
            Yeni duyuru ekle
          </Button>
          <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/programlar/yeni" />}>
            Yeni program ekle
          </Button>
          <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/sayfalar" />}>
            Sayfa metinlerini düzenle
          </Button>
          <Button variant="outline" className="w-full justify-start" render={<Link href="/" target="_blank" />}>
            <ExternalLink className="size-4" />
            Siteyi görüntüle
          </Button>
        </div>
      </div>
    </div>
  );
}
