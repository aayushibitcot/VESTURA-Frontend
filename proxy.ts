import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Proxy for route handling and redirecting old /private and /public paths
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Redirect old /private/* paths to clean paths
  if (pathname.startsWith("/private/")) {
    const newPath = pathname.replace("/private", "")
    const url = request.nextUrl.clone()
    url.pathname = newPath
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  // Redirect old /public/* paths to clean paths
  if (pathname.startsWith("/public/")) {
    const newPath = pathname.replace("/public", "")
    const url = request.nextUrl.clone()
    url.pathname = newPath
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/private/:path*",
    "/public/:path*",
    "/shop/:path*",
    "/product/:path*",
    "/contact",
    "/cart/:path*",
    "/login",
    "/checkout",
    "/order-success",
    "/success",
    "/my-orders/:path*",
  ],
}

