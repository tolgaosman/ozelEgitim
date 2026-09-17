"use client";

import { useActionState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiryAction } from "@/app/iletisim/actions";
import type { InquiryFormState } from "@/lib/schemas/inquiry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INITIAL_FORM_STATE: InquiryFormState = { status: "idle", message: "" };

/**
 * Program listesi artık burada sabit değil: sunucu bileşeni
 * `fetchProgramCollection()` sonucunu bu bileşene geçiriyor. Böylece panelden
 * eklenen bir program otomatik olarak forma da düşer ve slug listesinin
 * ikinci bir kopyası kodda tutulmaz.
 */
export type ProgramOption = {
  value: string;
  label: string;
};

const UNDECIDED_PROGRAM_OPTION: ProgramOption = {
  value: "",
  label: "Fark etmez / Görüşmede belirleyelim",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function InquiryForm({ programOptions: availablePrograms }: { programOptions: ProgramOption[] }) {
  const searchParams = useSearchParams();
  const defaultProgram = searchParams.get("program") || "";
  const programOptions = [UNDECIDED_PROGRAM_OPTION, ...availablePrograms];

  const [formState, formAction, isSubmitPending] = useActionState(
    submitInquiryAction,
    INITIAL_FORM_STATE,
  );

  if (formState.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-grass-500/30 bg-grass-100 px-6 py-12 text-center"
      >
        <CheckCircle2 className="size-10 text-grass-600" aria-hidden="true" />
        <p className="font-display text-lg font-bold text-navy-800">Teşekkürler!</p>
        <p className="max-w-sm text-sm text-ink-soft">{formState.message}</p>
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
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s\.\-]/g, "");
            }}
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
            placeholder="Örn. 6"
            aria-invalid={Boolean(formState.fieldErrors?.childAgeLabel)}
            aria-describedby={formState.fieldErrors?.childAgeLabel ? "childAgeLabel-error" : undefined}
            onInput={(e) => {
              let val = e.currentTarget.value.replace(/[^0-9]/g, "");
              if (val.length > 2) val = val.slice(0, 2);
              e.currentTarget.value = val;
            }}
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
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s\+]/g, "");
            }}
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
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
            }}
          />
          <div id="email-error">
            <FieldError message={formState.fieldErrors?.email} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="programOfInterest">İlgilendiğiniz Program</Label>
        <Select name="programOfInterest" defaultValue={defaultProgram}>
          <SelectTrigger
            id="programOfInterest"
            className={cn(
              "h-11 w-full bg-background px-3 text-base md:text-sm",
            )}
          >
            <SelectValue placeholder="İlgilendiğiniz Programı Seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            <SelectGroup>
              {programOptions.map((option, index) => (
                <Fragment key={option.value}>
                  <SelectItem value={option.value} className="py-2.5">
                    {option.label}
                  </SelectItem>
                  {index < programOptions.length - 1 && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Eklemek İstedikleriniz (isteğe bağlı)</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Çocuğunuz hakkında kısaca bilgi verebilirsiniz." />
      </div>

      <Button type="submit" size="pill" disabled={isSubmitPending} className="w-full sm:w-auto">
        {isSubmitPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitPending ? "Gönderiliyor..." : "Ön Görüşme Talebini Gönder"}
      </Button>
    </form>
  );
}
