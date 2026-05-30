import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { getSeoRedirect } from "@/lib/seo/redirects";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  const urlWithRealHost = new URL(request.nextUrl.toString());
  urlWithRealHost.hostname = host.split(":")[0];
  const redirect = getSeoRedirect(urlWithRealHost);

  if (redirect) {
    return NextResponse.redirect(redirect.destination, redirect.statusCode);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Covers ALL paths including /sitemap.xml and /robots.txt,
  // except Next.js assets and static files (images, fonts, css, js).
  // This ensures non-www -> www redirect works for every URL,
  // eliminating duplicate domain indexing by Google.
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|ico|svg|css|js|woff2?|ttf|eot)$).*)"
  ]
};
