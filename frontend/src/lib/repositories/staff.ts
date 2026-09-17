import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createCollectionEnvelopeSchema } from "@/lib/schemas/common";
import { StaffMemberSchema, type StaffMember } from "@/lib/schemas/staff";
import { mockStaffMembers } from "@/mocks/staff";

const StaffCollectionResponseSchema = createCollectionEnvelopeSchema(StaffMemberSchema);

export async function fetchStaffCollection(): Promise<StaffMember[]> {
  if (!isApiConfigured()) {
    return sortByOrder(mockStaffMembers);
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/staff-members", StaffCollectionResponseSchema, {
        tags: ["staff-members"],
      });
      return sortByOrder(response.data);
    },
    sortByOrder(mockStaffMembers),
    "kadro listesi",
  );
}

function sortByOrder(staffMembers: StaffMember[]): StaffMember[] {
  return [...staffMembers].sort((firstMember, secondMember) => firstMember.sortOrder - secondMember.sortOrder);
}
