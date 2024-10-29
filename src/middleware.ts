import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const session = request.cookies.get("session")

  const response = NextResponse.next()

  return response
}
