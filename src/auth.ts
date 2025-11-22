import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import db from './lib/db';
import bcrypt from 'bcryptjs';
import type { User } from 'next-auth';

// Extend the built-in session types
declare module 'next-auth' {
    interface User {
        role?: string;
    }
    interface Session {
        user: User & {
            role?: string;
        };
    }
}

async function getUser(email: string): Promise<any> {
    try {
        const user = await db('users').where({ email }).first();
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password_hash);
                    if (passwordsMatch) {
                        // Return user object for the session
                        // We map DB fields to NextAuth User fields if needed, but here they match mostly
                        return {
                            id: user.id,
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email,
                            role: user.role
                        };
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    }
});
