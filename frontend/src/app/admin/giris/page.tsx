import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { Shape, ShapeField } from "@/components/shared/shape-field";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookie";

export const metadata: Metadata = { title: "Giriş" };

const API_BASE_URL = process.env.API_BASE_URL;

/** Zaten geçerli bir oturumu olan ziyaretçi tekrar şifre sormadan panele yönlendirilir. */
async function hasValidSession(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token || !API_BASE_URL) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    // Backend'e ulaşılamıyorsa formu göstermeye devam ederiz.
    return false;
  }
}

export default async function AdminLoginPage() {
  // `redirect()` iç mekaniği bir istisna fırlatarak çalışır — bu yüzden
  // `try/catch` İÇİNDE çağrılmaz; aksi halde catch bloğu onu yutar ve zaten
  // giriş yapmış bir ziyaretçi yeniden şifre formuyla karşılaşır.
  if (await hasValidSession()) {
    redirect("/admin");
  }

  return (
    <div className="relative grid min-h-svh grid-cols-1 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
      {/* Sol panel: sitenin fotoğraf + karartma + dekoratif şekil dili */}
      <div className="relative flex h-[34svh] shrink-0 items-end overflow-hidden bg-navy-900 lg:h-auto lg:items-center">
        <Image
          src="/images/hero-staff.jpg"
          alt=""
          fill
          preload
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
        <div className="scrim-full absolute inset-0" aria-hidden="true" />
        <ShapeField>
          <Shape color="aqua" form="circle" scale={0.7} className="-top-16 right-[8%]" />
          <Shape color="peach" form="square" scale={0.5} className="-bottom-14 left-[6%]" />
          <Shape color="grass" form="circle" scale={0.35} blend className="top-[20%] left-[12%]" />
        </ShapeField>

        <div className="relative z-10 flex w-full flex-col gap-6 p-8 pb-10 sm:p-12 lg:pb-16">
          <Image
            src="/assets/logo-lockup-white.png"
            alt="İz Özel Eğitim Merkezi"
            width={180}
            height={56}
            className="h-10 w-auto object-contain drop-shadow-md sm:h-12"
          />
          <div className="hidden lg:block">
            <span className="block pb-1 font-display text-strap font-semibold text-white">Yönetim</span>
            <span className="block font-display text-display-lg font-extrabold text-aqua-500 uppercase">Paneli</span>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80">
              Programları, duyuruları, kadroyu ve sayfa içeriklerini buradan yönetin — değişiklikler anında sitede
              yayınlanır.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ panel: giriş formu */}
      <div className="relative flex flex-1 items-center justify-center bg-paper px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wide text-navy-800 uppercase">Güvenli giriş</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Tekrar hoş geldiniz</h1>
            <p className="mt-2 text-sm text-ink-soft">Devam etmek için yönetici şifrenizi girin.</p>
          </div>

          <LoginForm />

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-navy-800"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Siteye dön
            </Link>
            <p className="text-xs font-medium text-ink-faint">İz Özel Eğitim Merkezi © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
