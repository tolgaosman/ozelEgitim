/**
 * Yönetim paneli API'sinin şekilleri. Herkese açık siteden farklı olarak
 * bu tipler Zod ile doğrulanmaz: panel, kendi backend'ine güvenen
 * kimlik doğrulamalı bir iç araçtır (bkz. docs/architecture.md §3),
 * halka açık sitedeki "backend sapması" savunmasına ihtiyacı yoktur.
 */

export type MetaOption<Value = string> = { value: Value; label: string };

export type AdminMeta = {
  programIcons: MetaOption[];
  announcementCategories: MetaOption[];
  faqCategories: MetaOption[];
  inquiryStatuses: (MetaOption & { color: string })[];
  programs: (MetaOption<number> & { slug: string })[];
};

export type DashboardSummary = {
  counts: {
    newInquiries: number;
    programs: number;
    announcements: number;
    staffMembers: number;
  };
  recentInquiries: AdminInquiry[];
};

export type AdminHighlight = { title: string; description: string };

export type AdminProgram = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string[];
  icon: string;
  ageRangeLabel: string;
  sessionFormatLabel: string;
  highlights: AdminHighlight[];
  imagePath: string | null;
  imageUrl?: string;
  sortOrder: number;
  publishedAt: string | null;
  isPublished: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type AdminAnnouncement = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  imagePath: string | null;
  imageUrl?: string;
  category: string;
  sortOrder: number;
  publishedAt: string | null;
  isPublished: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type AdminStaffMember = {
  id: number;
  slug: string;
  fullName: string;
  title: string;
  specialties: string[];
  education: string[];
  bio: string;
  photoPath: string | null;
  photoUrl?: string;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
};

export type AdminFaq = {
  id: number;
  category: string;
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
  deletedAt: string | null;
};

export type AdminTestimonial = {
  id: number;
  parentName: string;
  relationLabel: string;
  quote: string;
  programId: number | null;
  programName: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminSiteStat = {
  id: number;
  targetValue: number;
  suffix: string;
  label: string;
  sortOrder: number;
};

export type AdminInquiry = {
  id: number;
  parentFullName: string;
  childAgeLabel: string;
  phoneNumber: string;
  email: string | null;
  programOfInterest: string | null;
  message: string | null;
  status: "yeni" | "iletisimde" | "tamamlandi";
  internalNote: string | null;
  handledAt: string | null;
  createdAt: string;
};

export type AdminSiteSettings = {
  contact: {
    phoneDisplay: string;
    phoneTel: string;
    whatsappUrl: string;
    email: string;
    address: string;
    mapsUrl: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  openingHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  kvkkBody: string[];
  stats: AdminSiteStat[];
};
