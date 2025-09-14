import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("privy-token");
  const session = req.cookies.get("privy-session");
  const path = req.nextUrl.pathname;

  // Public assets and API routes skip auth
  if (
    path.startsWith("/_next") ||
    path.startsWith("/fonts") ||
    path.startsWith("/images") ||
    path.endsWith(".ico") ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Handle OAuth redirect
  if (req.nextUrl.searchParams.get("privy_oauth_code")) {
    return NextResponse.next();
  }

  // Allow refresh page to run
  if (path.startsWith("/refresh")) {
    return NextResponse.next();
  }

  const isAuthenticated = Boolean(token);
  const hasSession = Boolean(session);

  // Token expired, but session exists → redirect to refresh
  if (!isAuthenticated && hasSession) {
    const url = new URL("/refresh", req.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Unauthenticated user
  if (!isAuthenticated) {
    if (path.startsWith("/auth") || path === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Authenticated user trying to access /auth → redirect home
  if (isAuthenticated && path.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/.*).*)"],
};
