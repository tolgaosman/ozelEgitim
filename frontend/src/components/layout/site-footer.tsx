import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { footerNavigation } from "@/lib/navigation";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_SOCIAL_LINKS,
} from "@/lib/seo/constants";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/assets/browserLogo.png" alt="" width={36} height={36} className="size-9" />
              <span className="font-heading text-lg font-semibold text-white">{SITE_NAME}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Her çocuğun kendine özgü bir öğrenme yolculuğu vardır. Biz bu yolculukta
              ailelerin yanında, bilime dayalı ve şefkatli bir eğitim ortamı sunarız.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE_SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowUpRight className="size-4.5" aria-hidden="true" />
                <span className="sr-only">Instagram (yeni sekmede açılır)</span>
              </a>
              <a
                href={SITE_SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowUpRight className="size-4.5" aria-hidden="true" />
                <span className="sr-only">Facebook (yeni sekmede açılır)</span>
              </a>
              <a
                href={SITE_SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowUpRight className="size-4.5" aria-hidden="true" />
                <span className="sr-only">YouTube (yeni sekmede açılır)</span>
              </a>
            </div>
          </div>

          <FooterColumn title="Kurumsal" links={footerNavigation.kurumsal} />
          <FooterColumn title="Aileler İçin" links={footerNavigation.aileler} />

          <div>
            <h3 className="font-heading text-sm font-semibold text-white">İletişim</h3>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{SITE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href={`tel:${SITE_PHONE_TEL}`} className="hover:text-white">
                  {SITE_PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${SITE_EMAIL}`} className="hover:text-white">
                  {SITE_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap gap-4">
            {footerNavigation.kurumsalBilgi.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
