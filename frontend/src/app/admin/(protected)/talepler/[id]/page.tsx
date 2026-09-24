import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { InquiryDetailForm } from "@/components/admin/inquiries/inquiry-detail-form";
import { adminGet } from "@/lib/admin/client";
import { deleteInquiryAction } from "@/lib/admin/actions/inquiries";
import type { AdminInquiry, AdminMeta } from "@/lib/admin/types";
import { formatDateLabel } from "@/lib/format";

export const metadata = { title: "Talep Detayı" };

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-ink-faint uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: inquiry }, { data: meta }] = await Promise.all([
    adminGet<{ data: AdminInquiry }>(`/api/admin/inquiries/${id}`),
    adminGet<{ data: AdminMeta }>("/api/admin/meta"),
  ]);

  const whatsappNumber = inquiry.phoneNumber.replace(/[^0-9]/g, "");
  const programLabel = inquiry.programOfInterest
    ? (meta.programs.find((program) => program.slug === inquiry.programOfInterest)?.label ?? inquiry.programOfInterest)
    : "Belirtilmemiş";

  return (
    <div className="space-y-6">
      <Link href="/admin/talepler" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" />
        Taleplere dön
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{inquiry.parentFullName}</h1>
          <p className="mt-1 text-sm text-ink-soft">{formatDateLabel(inquiry.createdAt)} tarihinde gönderildi</p>
        </div>
        <DeleteButton
          itemLabel="Bu talep"
          variant="permanent"
          size="sm"
          redirectTo="/admin/talepler"
          action={deleteInquiryAction.bind(null, inquiry.id)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-ink">Velinin gönderdiği bilgiler</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Çocuğun yaşı" value={inquiry.childAgeLabel} />
            <InfoRow label="Telefon" value={inquiry.phoneNumber} />
            <InfoRow label="E-posta" value={inquiry.email || "Belirtilmedi"} />
            <InfoRow label="İlgilenilen program" value={programLabel} />
          </dl>
          {inquiry.message ? (
            <div>
              <p className="text-xs font-bold tracking-wide text-ink-faint uppercase">Veli notu</p>
              <p className="mt-1 rounded-xl bg-paper p-4 text-sm leading-relaxed text-ink-soft">{inquiry.message}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" render={<a href={`tel:${inquiry.phoneNumber}`} />}>
              <Phone className="size-3.5" />
              Ara
            </Button>
            <Button variant="outline" size="sm" render={<a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" />}>
              <MessageCircle className="size-3.5" />
              WhatsApp
            </Button>
            {inquiry.email ? (
              <Button variant="outline" size="sm" render={<a href={`mailto:${inquiry.email}`} />}>
                <Mail className="size-3.5" />
                E-posta Gönder
              </Button>
            ) : null}
          </div>
        </div>

        <InquiryDetailForm inquiry={inquiry} statuses={meta.inquiryStatuses} />
      </div>
    </div>
  );
}
