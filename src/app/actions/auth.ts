'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string;
    success?: boolean;
};

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const validatedFields = RegisterSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Register.',
        };
    }

    const { firstName, lastName, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            return {
                message: 'User already exists.',
            };
        }

        await db('users').insert({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password_hash: hashedPassword,
            role: 'customer', // Default role
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.',
        };
    }

    // Redirect or return success (client can handle redirect to login)
    return { success: true };
}
