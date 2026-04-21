import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { getSeoRedirect } from "@/lib/seo/redirects";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const redirect = getSeoRedirect(request.nextUrl);

  if (redirect) {
    return NextResponse.redirect(redirect.destination, redirect.statusCode);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(en|pl|es|de|fr)/:path*"]
};
