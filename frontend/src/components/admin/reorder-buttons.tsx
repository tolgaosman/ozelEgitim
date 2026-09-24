import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sürükle-bırak yerine bilinçli olarak yukarı/aşağı butonları: JavaScript
 * hiç yüklenmeden de çalışır (her buton kendi `<form action>`ına sahiptir),
 * klavyeyle tam erişilebilirdir ve istemci tarafında karmaşık bir sürükleme
 * kütüphanesi gerektirmez.
 */
export function ReorderButtons({
  moveUpAction,
  moveDownAction,
  disableUp,
  disableDown,
}: {
  /**
   * Bir Server Action referansı olmalıdır (ör. `reorderProgramsAction.bind(null, ids)`)
   * — burada tanımlanan sıradan bir closure DEĞİL. `<form action>` yalnızca
   * gerçek Server Action referanslarını kabul eder; bu bileşen bilinçli
   * olarak sarmalamaz.
   */
  moveUpAction: () => Promise<void>;
  moveDownAction: () => Promise<void>;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <form action={moveUpAction}>
        <Button type="submit" variant="ghost" size="icon-xs" disabled={disableUp} aria-label="Yukarı taşı">
          <ArrowUp className="size-3.5" />
        </Button>
      </form>
      <form action={moveDownAction}>
        <Button type="submit" variant="ghost" size="icon-xs" disabled={disableDown} aria-label="Aşağı taşı">
          <ArrowDown className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}
