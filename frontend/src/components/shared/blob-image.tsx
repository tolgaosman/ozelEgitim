import Image from "next/image";
import { cn } from "@/lib/utils";

type BlobImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Organik (blob) `border-radius` maskeli fotoğraf — asimetrik anlatı bölmelerinde kullanılır. */
export function BlobImage({ src, alt, priority, sizes = "560px", className }: BlobImageProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ borderRadius: "63% 37% 54% 46% / 43% 51% 49% 57%" }}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  );
}
