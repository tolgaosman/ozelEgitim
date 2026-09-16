import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AccessibilityMenu } from "@/components/layout/accessibility-menu";
import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { NavDropdownItem } from "@/components/layout/nav-dropdown-item";
import { Container } from "@/components/shared/container";
import { primaryNavigation } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/seo/constants";

export function AccessibleNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 supports-backdrop-filter:backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-3 sm:h-24">
        <Link href="/" className="flex items-center rounded-lg py-1 shrink-0">
          <Image
            src="/assets/siteLogo-tr.jpg"
            alt={SITE_NAME}
            width={200}
            height={200}
            priority
            className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply scale-[1.3] sm:scale-[1.4] origin-left dark:mix-blend-normal dark:bg-white/90 dark:rounded-xl dark:p-1"
          />
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-0.5 lg:flex">
          {primaryNavigation.map((item) => (
            <NavDropdownItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AccessibilityMenu />
          <Button
            render={<Link href="/kayit" />}
            className="hidden sm:inline-flex"
          >
            Ön Görüşme Talep Et
          </Button>
          <MobileNavSheet />
        </div>
      </Container>
    </header>
  );
}
