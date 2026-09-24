"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteButtonProps = {
  /** Silinecek kaydı tanımlayan isim — onay metninde gösterilir. */
  itemLabel: string;
  action: () => Promise<{ error?: string } | void>;
  /** Yumuşak silme ("çöp kutusuna taşı") ile kalıcı silme arasındaki metin farkı. */
  variant?: "trash" | "permanent";
  size?: "icon-sm" | "sm";
  /** Silme başarılı olunca yönlendirilecek adres (ör. detay sayfasından listeye dönüş). */
  redirectTo?: string;
}

export function DeleteButton({ itemLabel, action, variant = "trash", size = "icon-sm", redirectTo }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm(): void {
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(variant === "trash" ? "Çöp kutusuna taşındı." : "Silindi.");
      if (redirectTo) router.push(redirectTo);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size={size} aria-label={`${itemLabel} sil`}>
            <Trash2 className="size-4" />
            {size === "sm" ? "Sil" : null}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{itemLabel} silinsin mi?</DialogTitle>
          <DialogDescription>
            {variant === "trash"
              ? "Kayıt çöp kutusuna taşınır ve sitede hemen görünmez olur; istediğiniz zaman geri alabilirsiniz."
              : "Bu işlem geri alınamaz."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Vazgeç</Button>} />
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {variant === "trash" ? "Çöp Kutusuna Taşı" : "Kalıcı Olarak Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
