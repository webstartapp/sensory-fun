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
                    // Note: We can't easily check role here without session strategy or putting role in token
                    // For now, we rely on the token having the role, which we ensure in auth.ts
                    return (auth.user as any).role === 'admin';
                }
                return false; // Redirect unauthenticated users to login page
            }

            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
