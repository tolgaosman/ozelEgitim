const turkishDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDateLabel(isoDate: string): string {
  return turkishDateFormatter.format(new Date(isoDate));
}

const announcementCategoryLabels: Record<string, string> = {
  etkinlik: "Etkinlik",
  duyuru: "Duyuru",
  "basari-hikayesi": "Başarı Hikayesi",
};

export function formatAnnouncementCategoryLabel(category: string): string {
  return announcementCategoryLabels[category] ?? category;
}

const faqCategoryLabels: Record<string, string> = {
  kayit: "Kayıt Süreci",
  programlar: "Programlar",
  "gunluk-yasam": "Günlük Yaşam",
  "mali-destek": "Mali Destek",
};

export function formatFaqCategoryLabel(category: string): string {
  return faqCategoryLabels[category] ?? category;
}
