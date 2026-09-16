import Image from "next/image";
import { cn } from "@/lib/utils";

type ArchImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Boy oranı ve boyutu belirler, örn. "aspect-[3/4] w-full". */
  className?: string;
};

/**
 * Üstü kemer (yarım daire) maskeli fotoğraf — portrelerde ve program
 * kartlarında imza görsel form. `className` ile boy oranı ebeveynden
 * verilmelidir (bu bileşen yalnızca maskeyi ve `object-cover`'ı uygular).
 */
export function ArchImage({ src, alt, priority, sizes = "480px", className }: ArchImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-t-full", className)}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  );
}
