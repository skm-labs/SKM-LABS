import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res  = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect /admin — redirect to /login if not authenticated
  if (!session && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If already logged in and hits /login, send to admin
  if (session && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
