"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ArrowUpRight, Menu, PhoneCall, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryNavigation } from "@/lib/navigation";
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/seo/constants";

/**
 * Sitenin tek gezinme yüzeyi — hem masaüstü hem mobilde aynı tam ekran
 * lacivert panel açılır (referans sitenin deseni). Odak tuzağı, Esc ile
 * kapanma, arka plan kaydırma kilidi ve portallanmış render `@base-ui/react`
 * Dialog primitifinden gelir; burada yalnız görünüm ve içerik eklenir.
 */
export function FullScreenNav() {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        render={
          <button
            type="button"
            className="hover-bar flex min-h-11 items-center gap-2 text-sm font-bold tracking-wide text-white uppercase"
          >
            <Menu className="size-5" aria-hidden="true" />
            Menü
          </button>
        }
      />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-navy-900/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          data-on-dark
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy-900 text-white transition-transform duration-300 ease-[var(--ease-spring)] data-ending-style:translate-y-4 data-ending-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:opacity-0"
        >
          <div className="flex items-center justify-between gap-3 px-[var(--gutter)] py-3 sm:py-4">
            <Link href="/" className="block">
              <Image
                src="/assets/logo-lockup-white.png"
                alt=""
                width={300}
                height={156}
                className="h-12 w-auto sm:h-16 md:h-20"
              />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Menünün altında zaten bir CTA var; dar ekranda başlık şeridi taşıyordu. */}
              <Link
                href="/iletisim"
                className="hover-bar hidden min-h-11 items-center gap-2 px-3 text-sm font-bold tracking-wide text-white uppercase sm:inline-flex"
              >
                İletişime Geç
              </Link>
              <DialogPrimitive.Close
                render={
                  <button
                    type="button"
                    className="flex min-h-11 items-center gap-2 text-sm font-bold tracking-wide uppercase hover:opacity-80"
                  >
                    <X className="size-5" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Kapat</span>
                  </button>
                }
              />
            </div>
          </div>

          <DialogPrimitive.Title className="sr-only">Ana menü</DialogPrimitive.Title>

          <nav aria-label="Ana menü" className="flex-1 px-[var(--gutter)] py-4 sm:py-5">
            <ul className="mx-auto max-w-3xl space-y-0.5">
              {primaryNavigation.filter((item) => item.href !== "/iletisim").map((item) => {
                const isActive = item.children
                  ? (item.children.some((child) => child.href === pathname) || pathname === item.href)
                  : pathname === item.href;

                return (
                  <li key={item.href} className="border-b border-white/15">
                    <DialogPrimitive.Close
                      nativeButton={false}
                      render={
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "block py-2 text-xl font-extrabold tracking-[-0.01em] break-words uppercase transition-colors sm:py-2.5 sm:text-2xl md:text-3xl",
                            isActive ? "text-aqua-500" : "text-white hover:text-aqua-500",
                          )}
                        />
                      }
                    >
                      {item.label}
                    </DialogPrimitive.Close>

                    {item.children ? (
                      <ul className="grid grid-cols-1 gap-1 pb-3 sm:grid-cols-2">
                        {item.children.map((childLink) => (
                          <li key={childLink.href}>
                            <DialogPrimitive.Close
                              nativeButton={false}
                              render={
                                <Link
                                  href={childLink.href}
                                  className="group/child flex items-start gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/5"
                                />
                              }
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-aqua-500 transition-colors group-hover/child:bg-aqua-500 group-hover/child:text-navy-900">
                                <childLink.icon className="size-3.5" aria-hidden="true" />
                              </span>
                              <span className="min-w-0">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                                  {childLink.label}
                                  <ArrowUpRight
                                    className="size-3.5 shrink-0 text-white/40 transition-transform duration-300 ease-[var(--ease-spring)] group-hover/child:translate-x-0.5 group-hover/child:-translate-y-0.5 group-hover/child:text-aqua-500"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="block truncate text-xs leading-relaxed text-white/60">
                                  {childLink.description}
                                </span>
                              </span>
                            </DialogPrimitive.Close>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col gap-2 border-t border-white/15 px-[var(--gutter)] py-3 sm:flex-row sm:items-center sm:justify-between">
            <a href={`tel:${SITE_PHONE_TEL}`} className="hover-bar inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
              <PhoneCall className="size-4" aria-hidden="true" />
              {SITE_PHONE_DISPLAY}
            </a>
            <DialogPrimitive.Close
              nativeButton={false}
              render={
                <Link
                  href="/iletisim"
                  aria-current={pathname === "/iletisim" ? "page" : undefined}
                  className={cn(
                    "hover-bar inline-block text-xl font-extrabold tracking-[-0.01em] uppercase transition-colors sm:text-2xl",
                    pathname === "/iletisim" ? "text-aqua-500" : "text-white hover:text-aqua-500",
                  )}
                />
              }
            >
              İletişim
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
