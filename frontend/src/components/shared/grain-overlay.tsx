import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Koyu dolu bantlara (orman yeşili, kontrast bandı) çok hafif doku katan
 * dekoratif gürültü katmanı — düz renk bloklarının "dijital" hissini kırar.
 * Tamamen dekoratif olduğundan ekran okuyuculardan gizlenir.
 */
export function GrainOverlay({ className }: { className?: string }) {
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full opacity-[0.06] mix-blend-overlay", className)}
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
