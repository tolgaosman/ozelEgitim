import { cn } from "@/lib/utils";

type CurveDividerProps = {
  /** Eğrinin altında kalacak zeminle aynı renk (örn. "var(--forest-900)"). */
  fill: string;
  flip?: boolean;
  className?: string;
};

/** Açık↔koyu bant geçişlerinde kullanılan yumuşak eğri ayraç. Tamamen dekoratiftir. */
export function CurveDivider({ fill, flip = false, className }: CurveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full overflow-hidden leading-none", flip && "rotate-180", className)}
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-[44px] w-full sm:h-[72px]">
        <path
          d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,48 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
