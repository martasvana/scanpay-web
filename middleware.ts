import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware completely for auth callback route to prevent rate limiting
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }
  
  const response = NextResponse.next();
  
  return response;
}

// Add routes that require auth protection here
export const config = {
  matcher: [
    // Only match specific routes that need middleware
    // Explicitly exclude auth/callback and static assets
    '/((?!auth/callback|_next/static|_next/image|favicon.ico|api).*)'
  ],
}; 