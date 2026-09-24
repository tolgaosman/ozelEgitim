"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { cn } from "@/lib/utils";
import { adminNavGroups } from "@/components/admin/nav-config";
import { logoutAction } from "@/lib/admin/actions/auth";

type AdminShellProps = {
  children: ReactNode;
  adminName: string;
  newInquiriesCount: number;
};

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({ pathname, newInquiriesCount, onNavigate }: { pathname: string; newInquiriesCount: number; onNavigate?: () => void }) {
  return (
    <nav className="scrollbar-hide flex-1 space-y-7 overflow-y-auto px-3 py-6">
      {adminNavGroups.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[11px] font-bold tracking-[0.14em] text-white/35 uppercase">{group.title}</p>
          <ul className="mt-2.5 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const badgeCount = item.badgeKey === "newInquiries" ? newInquiriesCount : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-lg py-2 pr-3 pl-3.5 text-sm font-medium transition-colors",
                      active ? "bg-aqua-500/10 text-aqua-500" : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active ? (
                      <span
                        className="absolute top-1/2 -left-3 h-5 w-1 -translate-y-1/2 rounded-r-full bg-aqua-500"
                        aria-hidden="true"
                      />
                    ) : null}
                    <item.icon className="size-4.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badgeCount > 0 ? (
                      <Badge className="h-5 min-w-5 justify-center bg-signal px-1.5 text-white">{badgeCount}</Badge>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="relative overflow-hidden border-b border-white/10 px-5 py-6">
      <ShapeField>
        <Shape color="aqua" form="circle" scale={0.3} blend className="-top-8 -right-6" />
      </ShapeField>
      <Image
        src="/assets/logo-lockup-white.png"
        alt="İz Özel Eğitim Merkezi"
        width={140}
        height={44}
        className="relative h-9 w-auto object-contain"
        preload
      />
      <p className="relative mt-2 text-xs font-bold tracking-[0.1em] text-white/40 uppercase">Yönetim Paneli</p>
    </div>
  );
}

function SidebarFooter({ adminName }: { adminName: string }) {
  const initial = adminName.trim().charAt(0).toUpperCase() || "İ";

  return (
    <div className="space-y-1 border-t border-white/10 px-3 py-4">
      <div className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-1.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm font-bold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{adminName}</span>
      </div>
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="size-4.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        Siteyi Görüntüle
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Çıkış Yap
        </button>
      </form>
    </div>
  );
}

export function AdminShell({ children, adminName, newInquiriesCount }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = adminNavGroups.flatMap((group) => group.items).find((item) => isActive(pathname, item.href));

  return (
    <div className="min-h-svh bg-paper">
      {/* Masaüstü sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy-900 lg:flex">
        <SidebarHeader />
        <NavLinks pathname={pathname} newInquiriesCount={newInquiriesCount} />
        <SidebarFooter adminName={adminName} />
      </aside>

      {/* Mobil üst çubuk + açılır menü */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Menüyü aç">
                <Menu />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 bg-navy-900 p-0">
            <SheetTitle className="sr-only">Yönetim menüsü</SheetTitle>
            <SidebarHeader />
            <NavLinks pathname={pathname} newInquiriesCount={newInquiriesCount} onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter adminName={adminName} />
          </SheetContent>
        </Sheet>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-bold text-ink">
          {activeItem?.label ?? "Panel"}
        </p>
        {/* Title ortalanmış kalsın diye sağda Menu butonu (w-10) genişliğinde boşluk bırakıyoruz */}
        <div className="w-10" />
      </header>

      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
