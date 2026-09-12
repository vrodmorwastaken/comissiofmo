import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/panel") && role !== "staff") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/la-meva-penya") && role !== "penya") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/panel/:path*", "/la-meva-penya/:path*"],
};
