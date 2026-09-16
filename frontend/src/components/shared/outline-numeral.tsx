import { cn } from "@/lib/utils";

/**
 * Dev, içi boş Fraunces rakamı — dekoratif sıralama vurgusu. Bilgiyi tek
 * başına taşımaz (her zaman gerçek bir başlıkla birlikte kullanılır), bu
 * yüzden ekran okuyucudan gizlenir.
 */
export function OutlineNumeral({ value, className }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("select-none font-display text-display-xl font-normal text-transparent", className)}
      style={{ WebkitTextStroke: "1.5px currentColor" }}
    >
      {value}
    </span>
  );
}
