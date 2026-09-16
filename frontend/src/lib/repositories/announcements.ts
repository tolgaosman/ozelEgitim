import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { createCollectionEnvelopeSchema, createResourceEnvelopeSchema } from "@/lib/schemas/common";
import { AnnouncementSchema, type Announcement } from "@/lib/schemas/announcement";
import { mockAnnouncements } from "@/mocks/announcements";

const AnnouncementCollectionResponseSchema = createCollectionEnvelopeSchema(AnnouncementSchema);
const AnnouncementResourceResponseSchema = createResourceEnvelopeSchema(AnnouncementSchema);

export async function fetchAnnouncementCollection(): Promise<Announcement[]> {
  if (!isApiConfigured()) {
    return sortByRecency(mockAnnouncements);
  }

  const response = await fetchJson("/api/announcements", AnnouncementCollectionResponseSchema, {
    tags: ["announcements"],
  });
  return sortByRecency(response.data);
}

export async function fetchAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  if (!isApiConfigured()) {
    return mockAnnouncements.find((announcement) => announcement.slug === slug) ?? null;
  }

  const response = await fetchJson(`/api/announcements/${slug}`, AnnouncementResourceResponseSchema, {
    tags: [`announcement:${slug}`],
  });
  return response.data;
}

function sortByRecency(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort(
    (firstAnnouncement, secondAnnouncement) =>
      new Date(secondAnnouncement.publishedAt).getTime() - new Date(firstAnnouncement.publishedAt).getTime(),
  );
}
