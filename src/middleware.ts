import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("privy-token");
  const cookieSession = req.cookies.get("privy-session");
  const path = req.nextUrl.pathname;

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

  if (req.nextUrl.searchParams.get("privy_oauth_code"))
    return NextResponse.next();

  if (path.startsWith("/refresh")) return NextResponse.next();

  const isAuthenticated = Boolean(token);
  const maybeAuthenticated = Boolean(cookieSession);

  if (!isAuthenticated && maybeAuthenticated) {
    const url = new URL("/refresh", req.url);
    url.searchParams.set("redirect_uri", path);
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && (isAuthPage || isHomePage))
    return NextResponse.next();

  if (isAuthenticated && isAuthPage)
    return NextResponse.redirect(new URL("/", req.url));

  if (!isAuthenticated && !maybeAuthenticated && !isAuthPage && !isHomePage)
    return NextResponse.redirect(new URL("/auth/signin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|api/.*).*)"],
};
