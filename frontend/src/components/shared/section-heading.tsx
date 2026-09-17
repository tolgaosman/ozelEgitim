import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-extrabold tracking-wider text-navy-800 uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-display-sm font-bold text-ink">{title}</h2>
      {description ? (
        <p
          className={cn(
            "text-base leading-relaxed text-ink-soft",
            align === "left" && "max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
