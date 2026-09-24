import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { footerNavigation } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/seo/constants";
import { fetchPageContentBlock } from "@/lib/repositories/page-content";
import { fetchSiteSettings } from "@/lib/repositories/site-settings";
import type { SiteSocialLinks } from "@/lib/schemas/site-settings";

/**
 * lucide-react bu sürümde marka/logo ikonları taşımıyor (lisans nedeniyle
 * kaldırıldılar), bu yüzden üç sosyal medya rozeti için küçük satır içi
 * SVG glifler kullanılıyor.
 */
function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9h3V5.5h-3C11.24 5.5 9.5 7.32 9.5 10v2H7v3.5h2.5V22h3.5v-6.5H16l.5-3.5h-3v-1.7c0-.86.4-1.3 1.5-1.3Z" />
    </svg>
  );
}

function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover-bar inline-block text-sm text-white/75 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Panelde boş bırakılan bir sosyal medya bağlantısı hiç gösterilmez. */
function buildSocialLinks(socialLinks: SiteSocialLinks) {
  return [
    { href: socialLinks.instagram, label: "Instagram", icon: InstagramGlyph },
    { href: socialLinks.facebook, label: "Facebook", icon: FacebookGlyph },
    { href: socialLinks.youtube, label: "YouTube", icon: YoutubeGlyph },
  ].filter((social): social is { href: string; label: string; icon: typeof InstagramGlyph } =>
    Boolean(social.href),
  );
}

export async function SiteFooter() {
  const [{ contact, socialLinks: configuredSocialLinks }, { tagline }] = await Promise.all([
    fetchSiteSettings(),
    fetchPageContentBlock("footer"),
  ]);
  const socialLinks = buildSocialLinks(configuredSocialLinks);

  return (
    <footer data-on-dark className="bg-navy-900 text-white/80">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Image
              src="/assets/logo-lockup-white.png"
              alt={SITE_NAME}
              width={426}
              height={222}
              className="h-12 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">{tagline}</p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-aqua-500 hover:text-navy-900"
                >
                  <social.icon className="size-4.5" aria-hidden="true" />
                  <span className="sr-only">{social.label} (yeni sekmede açılır)</span>
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Kurumsal" links={footerNavigation.kurumsal} />
          <FooterColumn title="Aileler İçin" links={footerNavigation.aileler} />

          <div>
            <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">İletişim</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-aqua-500" aria-hidden="true" />
                <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="hover-bar inline-block min-w-0 break-words hover:text-white">
                  {contact.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-aqua-500" aria-hidden="true" />
                <a href={`tel:${contact.phoneTel}`} className="hover-bar inline-block hover:text-white">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-aqua-500" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className="hover-bar inline-block break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap gap-4">
            {footerNavigation.kurumsalBilgi.map((link) => (
              <Link key={link.href} href={link.href} className="hover-bar inline-block hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
