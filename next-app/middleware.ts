/**
 * I am using middleware to handle auth logic as it seems
 * impossible to do it cleaning within page code.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const requiresAuth = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathName = request.nextUrl.pathname;

  // Authenticated users aren't shown the home page
  if (pathName === "/") {
    return token
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  // If a user tries to access an authed page they are prompted to sign in.
  if(requiresAuth.includes(pathName) && !token) {
    return NextResponse.redirect(new URL(`/signin?callback=${request.url}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
