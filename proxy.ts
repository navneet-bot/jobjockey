import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isCompanyRoute = createRouteMatcher(['/company(.*)']);
const isUserRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/profile(.*)',
    '/applications(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    // Redirect unauthenticated users trying to access protected routes
    if (!userId && (isAdminRoute(req) || isCompanyRoute(req) || isUserRoute(req))) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Basic User Route checks (All logged-in users generally have access at min)
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
