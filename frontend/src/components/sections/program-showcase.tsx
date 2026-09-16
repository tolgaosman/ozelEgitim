import Image from "next/image";
import Link from "next/link";
import { ArrowBadge } from "@/components/shared/arrow-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { OutlineNumeral } from "@/components/shared/outline-numeral";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import { resolveProgramImage } from "@/lib/program-images";
import type { Program } from "@/lib/schemas/program";

/**
 * Editoryal program ızgarası — Faz 1'deki eşit yükseklikte kart deseninin
 * yerini alır. Fotoğraf + içi boş sıra numarası + kayan ok rozeti; orta
 * sütun dikeyde hafifçe kaydırılarak monoton grid ritmi kırılır.
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
    <ul className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
      {visiblePrograms.map((program, index) => {
        const isOffsetColumn = index % 3 === 1;

        return (
          <Reveal
            key={program.id}
            delaySeconds={Math.min((index % 6) * 0.06, 0.24)}
            className={cn("h-full", isOffsetColumn && "lg:mt-16")}
          >
            <li className="group h-full list-none">
              <Link href={`/programlar/${program.slug}`} className="block focus-visible:outline-none">
                <div className="relative overflow-hidden rounded-[1.75rem] focus-visible:ring-3 focus-visible:ring-focus/50">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={resolveProgramImage(program.slug)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-105"
                    />
                    <div className="scrim-bottom absolute inset-0" aria-hidden="true" />
                    <OutlineNumeral
                      value={String(index + 1).padStart(2, "0")}
                      className="absolute top-4 left-4 text-3xl text-white/70 sm:text-4xl"
                    />
                    <p className="absolute right-4 bottom-4 left-4 text-sm font-medium text-white/90">
                      {program.ageRangeLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg leading-snug font-semibold text-ink">{program.name}</h3>
                  <ArrowBadge className="mt-0.5" />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{program.shortDescription}</p>
              </Link>
            </li>
          </Reveal>
        );
      })}
    </ul>
  );
}
