"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

/**
 * WAI-ARIA "disclosure navigation" deseni: üst öğe her zaman tıklanabilir bir
 * bağlantıdır (Gateway ilkesi — dropdown yalnızca kısayol), yanındaki ayrı
 * buton ise alt menüyü açıp kapatır. Bu ayrım, karmaşık `menu` ARIA rolü
 * yerine daha basit ve sağlam bir etkileşim modeli sağlar.
 */
export function NavDropdownItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const isActiveGroup = item.children?.some((child) => child.href === pathname) ?? pathname === item.href;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        aria-current={pathname === item.href ? "page" : undefined}
        className={cn(
          "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-ink",
          pathname === item.href ? "text-clay-600" : "text-ink-soft",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <Link
        href={item.href}
        aria-current={isActiveGroup ? "page" : undefined}
        className={cn(
          "rounded-l-lg py-2 pr-1 pl-3 text-sm font-medium transition-colors hover:bg-muted hover:text-ink",
          isActiveGroup ? "text-clay-600" : "text-ink-soft",
        )}
      >
        {item.label}
      </Link>
      <button
        ref={toggleButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="rounded-r-lg p-2 text-ink-soft transition-colors hover:bg-muted hover:text-ink"
      >
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
        <span className="sr-only">{item.label} alt menüsünü {isOpen ? "kapat" : "aç"}</span>
      </button>

      {isOpen ? (
        <div
          id={panelId}
          role="menu"
          aria-label={`${item.label} alt menüsü`}
          className="absolute top-full left-0 z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-[var(--shadow-raised)]"
        >
          {item.children.map((childLink) => (
            <Link
              key={childLink.href}
              href={childLink.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-sage-50 hover:text-sage-700"
            >
              {childLink.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
