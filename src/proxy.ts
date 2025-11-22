import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import createMiddleware from 'next-intl/middleware';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    // No explicit redirect or intl middleware needed for single locale
});

export const config = {
    // Matcher ignoring internal paths
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest).*)']
};