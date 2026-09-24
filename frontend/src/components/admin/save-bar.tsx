"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResourceFormState } from "@/lib/admin/form-state";

/**
 * Formların altında sabit bir kaydet çubuğu — mobilde de her zaman
 * ekranın altında kalır, uzun formlarda kullanıcı yukarı kaydırmak zorunda
 * kalmaz.
 */
export function SaveBar({
  isPending,
  cancelHref,
  error,
  saveLabel = "Kaydet",
  state,
}: {
  isPending: boolean;
  cancelHref: string;
  error?: string;
  saveLabel?: string;
  state?: ResourceFormState;
}) {
  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message || "İşlem başarıyla tamamlandı.");
      if (state.redirectUrl) {
        router.push(state.redirectUrl);
      }
    } else if (state?.status === "error") {
      toast.error(state.message || "Bir hata oluştu.");
    }
  }, [state, router]);
  return (
    <div className="sticky bottom-0 -mx-4 mt-8 flex flex-col gap-3 border-t border-border bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p role={error ? "alert" : undefined} className="text-sm font-medium text-signal">
        {error}
      </p>
      <div className="flex gap-2 sm:ml-auto">
        <Button type="button" variant="outline" render={<Link href={cancelHref} />}>
          Vazgeç
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-28">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
