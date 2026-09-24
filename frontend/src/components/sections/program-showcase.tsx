import Image from "next/image";
import Link from "next/link";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { resolveProgramImage } from "@/lib/program-images";
import type { Program } from "@/lib/schemas/program";

const accentBarColors = ["bg-aqua-500", "bg-grass-500", "bg-peach-400"] as const;

/**
 * Yumuşak köşeli program kartları ızgarası. Her kart üstte fotoğraf,
 * altında sırayla dönen renkli bir aksan çubuğu taşır; görsel üstten,
 * metin bloğu alttan yuvarlatılarak tek parça bir kart hissi verilir.
 */
export function ProgramShowcase({ programs, limit }: { programs: Program[]; limit?: number }) {
  const visiblePrograms = typeof limit === "number" ? programs.slice(0, limit) : programs;

  if (visiblePrograms.length === 0) {
    return (
      <EmptyState
        title="Şu anda listelenecek program bulunmuyor"
        description="Programlarımız hakkında bilgi almak için bizimle iletişime geçebilirsiniz."
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {visiblePrograms.map((program, index) => (
        <Reveal
          key={program.id}
          as="li"
          delaySeconds={Math.min((index % 6) * 0.06, 0.24)}
          className="group h-full list-none"
        >
          <Link href={`/programlar/${program.slug}`} className="block h-full focus-visible:outline-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
              <Image
                src={resolveProgramImage(program.slug, program.image)}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-105"
              />
            </div>
            <div className={accentBarColors[index % accentBarColors.length] + " h-1.5 w-full"} aria-hidden="true" />

            <div className="rounded-b-xl border border-t-0 border-border bg-white p-5">
              <p className="text-xs font-bold tracking-wide text-navy-600 uppercase">{program.ageRangeLabel}</p>
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <h3 className="min-w-0 font-display text-lg leading-snug font-bold text-ink">{program.name}</h3>
                <ArrowBadge className="mt-0.5" />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{program.shortDescription}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
