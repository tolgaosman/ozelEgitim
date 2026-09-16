"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiryAction } from "@/app/kayit/actions";
import type { InquiryFormState } from "@/lib/schemas/inquiry";
import { cn } from "@/lib/utils";

const INITIAL_FORM_STATE: InquiryFormState = { status: "idle", message: "" };

const programOptions = [
  { value: "", label: "Fark etmez / Görüşmede belirleyelim" },
  { value: "ozel-ogrenme-guclugu", label: "Özel Öğrenme Güçlüğü Destek Programı" },
  { value: "dil-ve-konusma-terapisi", label: "Dil ve Konuşma Terapisi" },
  { value: "otizm-spektrum-destek", label: "Otizm Spektrum Destek Programı" },
  { value: "zihinsel-yetersizlik-destek", label: "Zihinsel Yetersizlik Destek Eğitimi" },
  { value: "fizyoterapi-duyu-butunleme", label: "Fizyoterapi ve Duyu Bütünleme" },
  { value: "erken-cocukluk-ozel-egitimi", label: "Erken Çocukluk Özel Eğitimi" },
  { value: "dehb-destek-programi", label: "DEHB Destek Programı" },
  { value: "aile-danismanligi", label: "Aile Danışmanlığı" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function InquiryForm() {
  const [formState, formAction, isSubmitPending] = useActionState(
    submitInquiryAction,
    INITIAL_FORM_STATE,
  );

  if (formState.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-sage-200 bg-sage-50 px-6 py-12 text-center"
      >
        <CheckCircle2 className="size-10 text-sage-700" aria-hidden="true" />
        <p className="font-display text-lg font-semibold text-forest-800">Teşekkürler!</p>
        <p className="max-w-sm text-sm text-forest-700">{formState.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Bal küpü alanı: yalnızca botlar tarafından doldurulur, insan kullanıcıdan gizlenir. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Bu alanı boş bırakın</label>
        <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formState.status === "error" ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formState.message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="parentFullName">Veli Adı Soyadı</Label>
          <Input
            id="parentFullName"
            name="parentFullName"
            required
            className="h-11"
            autoComplete="name"
            aria-invalid={Boolean(formState.fieldErrors?.parentFullName)}
            aria-describedby={formState.fieldErrors?.parentFullName ? "parentFullName-error" : undefined}
          />
          <div id="parentFullName-error">
            <FieldError message={formState.fieldErrors?.parentFullName} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="childAgeLabel">Çocuğunuzun Yaşı</Label>
          <Input
            id="childAgeLabel"
            name="childAgeLabel"
            required
            className="h-11"
            placeholder="Örn. 6 yaş"
            aria-invalid={Boolean(formState.fieldErrors?.childAgeLabel)}
            aria-describedby={formState.fieldErrors?.childAgeLabel ? "childAgeLabel-error" : undefined}
          />
          <div id="childAgeLabel-error">
            <FieldError message={formState.fieldErrors?.childAgeLabel} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber">Telefon Numarası</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            className="h-11"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            aria-invalid={Boolean(formState.fieldErrors?.phoneNumber)}
            aria-describedby={formState.fieldErrors?.phoneNumber ? "phoneNumber-error" : undefined}
          />
          <div id="phoneNumber-error">
            <FieldError message={formState.fieldErrors?.phoneNumber} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="h-11"
            autoComplete="email"
            aria-invalid={Boolean(formState.fieldErrors?.email)}
            aria-describedby={formState.fieldErrors?.email ? "email-error" : undefined}
          />
          <div id="email-error">
            <FieldError message={formState.fieldErrors?.email} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="programOfInterest">İlgilendiğiniz Program</Label>
        <select
          id="programOfInterest"
          name="programOfInterest"
          defaultValue=""
          className={cn(
            "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring",
          )}
        >
          {programOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Eklemek İstedikleriniz (isteğe bağlı)</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Çocuğunuz hakkında kısaca bilgi verebilirsiniz." />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitPending} className="h-11 w-full sm:w-auto">
        {isSubmitPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitPending ? "Gönderiliyor..." : "Ön Görüşme Talebini Gönder"}
      </Button>
    </form>
  );
}
