"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldShell } from "@/components/admin/fields/field-shell";
import { updatePasswordAction, type UpdatePasswordFormState } from "@/lib/admin/actions/auth";

const INITIAL_STATE: UpdatePasswordFormState = { status: "idle" };

export function PasswordForm() {
  const [formState, formAction, isPending] = useActionState(updatePasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} className="max-w-md space-y-5 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
      <div>
        <h2 className="font-display text-base font-bold text-ink">Şifreyi Değiştir</h2>
        <p className="mt-1 text-sm text-ink-soft">Şifre değiştirildiğinde diğer tüm oturumlar sonlandırılır.</p>
      </div>

      <FieldShell label="Mevcut şifre" htmlFor="currentPassword" required>
        <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
      </FieldShell>
      <FieldShell label="Yeni şifre" htmlFor="newPassword" required hint="En az 8 karakter.">
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
      </FieldShell>
      <FieldShell label="Yeni şifre (tekrar)" htmlFor="newPassword_confirmation" required>
        <Input id="newPassword_confirmation" name="newPassword_confirmation" type="password" required minLength={8} autoComplete="new-password" />
      </FieldShell>

      {formState.status === "error" ? (
        <p role="alert" className="text-sm font-medium text-signal">
          {formState.message}
        </p>
      ) : null}
      {formState.status === "success" ? <p className="text-sm font-medium text-grass-600">{formState.message}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        Şifreyi Güncelle
      </Button>
    </form>
  );
}
