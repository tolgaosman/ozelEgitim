import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { fetchProgramCollection } from "@/lib/repositories/programs";
import { fetchAnnouncementCollection } from "@/lib/repositories/announcements";

const staticRoutes = [
  "",
  "/hakkimizda",
  "/programlar",
  "/duyurular",
  "/kadromuz",
  "/merkezimiz",
  "/sss",
  "/iletisim",
  "/kvkk",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, announcements] = await Promise.all([
    fetchProgramCollection(),
    fetchAnnouncementCollection(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const programEntries: MetadataRoute.Sitemap = programs.map((program) => ({
    url: `${SITE_URL}/programlar/${program.slug}`,
    lastModified: program.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const announcementEntries: MetadataRoute.Sitemap = announcements.map((announcement) => ({
    url: `${SITE_URL}/duyurular/${announcement.slug}`,
    lastModified: announcement.publishedAt,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...programEntries, ...announcementEntries];
}
