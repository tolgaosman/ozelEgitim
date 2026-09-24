"use client";

import { useActionState, useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginFormState } from "@/lib/admin/actions/auth";

const INITIAL_STATE: LoginFormState = { status: "idle" };

export function LoginForm() {
  const [formState, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-ink">
          Şifre
        </Label>
        <div className="relative">
          <KeyRound
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={formState.status === "error"}
            aria-describedby={formState.status === "error" ? "login-error" : undefined}
            onKeyUp={(event) => setIsCapsLockOn(event.getModifierState("CapsLock"))}
            className="h-12 pr-10 pl-10 text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>

        {isCapsLockOn ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-peach-500">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            Caps Lock açık
          </p>
        ) : null}

        {formState.status === "error" ? (
          <p id="login-error" role="alert" className="animate-shake text-sm font-medium text-signal">
            {formState.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="h-12 w-full bg-navy-800 text-white hover:bg-navy-900">
        {isPending ? (
          <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4.5" aria-hidden="true" />
        )}
        Giriş yap
      </Button>
    </form>
  );
}
