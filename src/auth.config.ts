import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn) {
                    // Check if user is admin
                    const isAdmin = (auth.user as any).role === 'admin';
                    if (isAdmin) return true;
                    // If logged in but not admin, return false (redirects to login) 
                    // OR we can let them through and let Layout handle 404?
                    // The user wants 404 for non-admins. 
                    // If we return false here, they go to login.
                    // If we return true, they hit the page, and Layout can show 404.
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            }

            // Redirect admin to dashboard if they are on home or login?
            // "whenever admin logins ... he should be redirected to admin dashboard"
            // This is usually handled in the login form action or `authorized` callback if they access /login while logged in.
            // Redirect logged-in users away from auth pages
            if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
                const isAdmin = (auth.user as any).role === 'admin';
                if (isAdmin) {
                    return Response.redirect(new URL('/admin', nextUrl));
                }
                return Response.redirect(new URL('/', nextUrl));
            }

            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
    trustHost: true,
} satisfies NextAuthConfig;
