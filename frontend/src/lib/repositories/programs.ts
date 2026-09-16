import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { createCollectionEnvelopeSchema, createResourceEnvelopeSchema } from "@/lib/schemas/common";
import { ProgramSchema, type Program } from "@/lib/schemas/program";
import { mockPrograms } from "@/mocks/programs";

const ProgramCollectionResponseSchema = createCollectionEnvelopeSchema(ProgramSchema);
const ProgramResourceResponseSchema = createResourceEnvelopeSchema(ProgramSchema);

/**
 * Laravel `GET /api/programs` uç noktasını yansıtır. Backend henüz devrede
 * değilse (veya erişilemezse) src/mocks/programs.ts içindeki tipli yer
 * tutucu veriye düşer; sayfa bileşenleri bu ayrımı hiç bilmez.
 */
export async function fetchProgramCollection(): Promise<Program[]> {
  if (!isApiConfigured()) {
    return sortByOrder(mockPrograms);
  }

  const response = await fetchJson("/api/programs", ProgramCollectionResponseSchema, {
    tags: ["programs"],
  });
  return sortByOrder(response.data);
}

export async function fetchProgramBySlug(slug: string): Promise<Program | null> {
  if (!isApiConfigured()) {
    return mockPrograms.find((program) => program.slug === slug) ?? null;
  }

  const response = await fetchJson(`/api/programs/${slug}`, ProgramResourceResponseSchema, {
    tags: [`program:${slug}`],
  });
  return response.data;
}

function sortByOrder(programs: Program[]): Program[] {
  return [...programs].sort((firstProgram, secondProgram) => firstProgram.sortOrder - secondProgram.sortOrder);
}
