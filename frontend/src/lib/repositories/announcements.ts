import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveRecordWithFallback, resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createCollectionEnvelopeSchema, createResourceEnvelopeSchema } from "@/lib/schemas/common";
import { AnnouncementSchema, type Announcement } from "@/lib/schemas/announcement";
import { mockAnnouncements } from "@/mocks/announcements";

const AnnouncementCollectionResponseSchema = createCollectionEnvelopeSchema(AnnouncementSchema);
const AnnouncementResourceResponseSchema = createResourceEnvelopeSchema(AnnouncementSchema);

export async function fetchAnnouncementCollection(): Promise<Announcement[]> {
  if (!isApiConfigured()) {
    return sortByRecency(mockAnnouncements);
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/announcements", AnnouncementCollectionResponseSchema, {
        tags: ["announcements"],
      });
      return sortByRecency(response.data);
    },
    sortByRecency(mockAnnouncements),
    "duyuru listesi",
  );
}

export async function fetchAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  const mockAnnouncement = mockAnnouncements.find((announcement) => announcement.slug === slug) ?? null;

  if (!isApiConfigured()) {
    return mockAnnouncement;
  }

  return resolveRecordWithFallback(
    async () => {
      const response = await fetchJson(
        `/api/announcements/${slug}`,
        AnnouncementResourceResponseSchema,
        { tags: [`announcement:${slug}`] },
      );
      return response.data;
    },
    mockAnnouncement,
    `duyuru (${slug})`,
  );
}

function sortByRecency(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort(
    (firstAnnouncement, secondAnnouncement) =>
      new Date(secondAnnouncement.publishedAt).getTime() - new Date(firstAnnouncement.publishedAt).getTime(),
  );
}
