import { NextResponse } from 'next/server';

// 1. The function MUST be named "middleware" and MUST be exported
export function middleware(request) {
  // Your RBAC or custom logic will go here later
    
    // For now, just let every request pass through successfully
    return NextResponse.next();
    }

    // 2. The config object tells Next.js where to run the middleware
    export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};