import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("privy-token")?.value;
  const path = req.nextUrl.pathname;

  // Allow static files
  const publicFile = /\.(.*)$/.test(path);
  const isNextStatic = path.startsWith("/_next/");
  const isFont = path.startsWith("/fonts");
  const isImage = path.startsWith("/images");
  const isAuthPage = path.startsWith("/auth");
  const isAPIRoute = path.startsWith("/api");
  const isForbiden = path.startsWith("/403");

  if (
    publicFile ||
    isNextStatic ||
    isFont ||
    isImage ||
    isAPIRoute ||
    isForbiden
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!token;

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return null;
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except:
    // - _next/*
    // - favicon
    // - auth pages
    // - API routes
    "/((?!_next/static|_next/image|favicon.ico|auth|auth/.*|api|api/.*|$).*)",
  ],
};
