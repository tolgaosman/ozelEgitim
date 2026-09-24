import {
  FileText,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareQuote,
  Quote,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Sidebar'da bir sayı rozeti gösterir (ör. yeni talep sayısı). */
  badgeKey?: "newInquiries";
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: "Genel",
    items: [{ href: "/admin", label: "Panel", icon: LayoutDashboard }],
  },
  {
    title: "Talepler",
    items: [{ href: "/admin/talepler", label: "Ön Görüşme Talepleri", icon: Inbox, badgeKey: "newInquiries" }],
  },
  {
    title: "İçerik",
    items: [
      { href: "/admin/programlar", label: "Programlar", icon: Sparkles },
      { href: "/admin/duyurular", label: "Duyurular", icon: FileText },
      { href: "/admin/kadro", label: "Kadromuz", icon: Users },
      { href: "/admin/sss", label: "Sıkça Sorulan Sorular", icon: MessageSquareQuote },
      { href: "/admin/veli-yorumlari", label: "Veli Yorumları", icon: Quote },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/admin/sayfalar", label: "Sayfa İçerikleri", icon: FileText },
      { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
    ],
  },
];

export const ADMIN_BRAND_NAME = "İz Özel Eğitim";
