import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("privy-token")?.value;
  const path = req.nextUrl.pathname;

  const isAuthenticated = !!token;

  const isPublicAsset =
    path.startsWith("/_next") ||
    path.startsWith("/fonts") ||
    path.startsWith("/images") ||
    path.endsWith(".ico");

  const isHomePage = path === "/";
  const isAuthPage = path.startsWith("/auth");
  const isAPIRoute = path.startsWith("/api");

  if (isPublicAsset || isAPIRoute) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (isHomePage || isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|api/.*).*)"
  ],
};
