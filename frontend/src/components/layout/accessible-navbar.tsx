"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { AccessibilityMenu } from "@/components/layout/accessibility-menu";
import { FullScreenNav } from "@/components/layout/full-screen-nav";
import { Container } from "@/components/shared/container";
import { SITE_NAME } from "@/lib/seo/constants";
import type { NavItem } from "@/lib/navigation";

type AccessibleNavbarProps = {
  phoneDisplay: string;
  phoneTel: string;
  primaryNavigation: NavItem[];
};

export function AccessibleNavbar({ phoneDisplay, phoneTel, primaryNavigation }: AccessibleNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-on-dark
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-navy-900 shadow-sm" : "bg-transparent"
      )}
    >
      <Container
        className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center gap-3 transition-all duration-300 ease-[var(--ease-spring)]",
          scrolled ? "h-20 sm:h-24" : "h-28 sm:h-32"
        )}
      >
        <div className="flex min-w-0 items-center">
          <FullScreenNav phoneDisplay={phoneDisplay} phoneTel={phoneTel} primaryNavigation={primaryNavigation} />
        </div>

        <Link href="/" className="flex min-w-0 items-center justify-self-center">
          <Image
            src="/assets/logo-lockup-white.png"
            alt={SITE_NAME}
            width={426}
            height={222}
            preload
            className={cn(
              "w-auto transition-all duration-300 ease-[var(--ease-spring)]",
              scrolled ? "h-11 sm:h-14" : "h-14 sm:h-20"
            )}
          />
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <AccessibilityMenu />
          <Link
            href="/iletisim"
            className="hover-bar hidden min-h-11 items-center gap-2 px-3 text-sm font-bold tracking-wide text-white uppercase sm:inline-flex"
          >
            İletişime Geç
          </Link>
        </div>
      </Container>
    </header>
  );
}
