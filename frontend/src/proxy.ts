import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookie";

/**
 * `/admin` için hızlı bir ön kapı: token çerezi yoksa isteği hiç Next.js
 * render ağacına sokmadan girişe yönlendirir. Bu YALNIZCA bir ön kontroldür
 * — çerez sahte veya süresi dolmuş olsa da buradan geçer. Gerçek doğrulama
 * `app/admin/layout.tsx` içinde `GET /api/admin/me` ile yapılır; 401
 * dönerse oradan tekrar girişe yönlendirilir.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/giris") {
    return NextResponse.next();
  }

  const hasToken = request.cookies.has(ADMIN_TOKEN_COOKIE);

  if (!hasToken) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
