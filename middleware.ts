import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for the admin section
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // In a real app, you would check for authentication and admin role
    // For demo purposes, we'll just check for a mock admin cookie
    const isAdmin = request.cookies.has("admin_authenticated")

    // If not authenticated as admin, redirect to login
    if (!isAdmin) {
      // In a real app, this would redirect to a login page
      // For demo, we'll just return a 401 response
      return new NextResponse(JSON.stringify({ success: false, message: "Admin authentication required" }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      })
    }
  }

  // Continue with the request if authenticated or not an admin route
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
