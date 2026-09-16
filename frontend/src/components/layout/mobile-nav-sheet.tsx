"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { primaryNavigation } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/seo/constants";

export function MobileNavSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Menüyü aç</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobil ana menü" className="flex flex-col gap-1 px-2 pb-6">
          {primaryNavigation.map((item) => (
            <div key={item.href} className="border-b border-border/60 py-1 last:border-none">
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-base font-medium",
                  pathname === item.href ? "text-clay-600" : "text-ink",
                )}
              >
                {item.label}
              </Link>
              {item.children ? (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                  {item.children.map((childLink) => (
                    <Link
                      key={childLink.href}
                      href={childLink.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-muted"
                    >
                      {childLink.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
