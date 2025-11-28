'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';

const PageSchema = z.object({
    slug: z.string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    is_published: z.coerce.boolean().optional(),
});

export async function createPage(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = PageSchema.safeParse({
        slug: formData.get('slug'),
        title: formData.get('title'),
        content: formData.get('content'),
        is_published: formData.get('is_published') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Page.',
        };
    }

    const { slug, title, content, is_published } = validatedFields.data;

    try {
        // Check if slug already exists
        const existing = await db('public_pages').where({ slug }).first();
        if (existing) {
            return {
                errors: { slug: ['Slug already exists'] },
                message: 'Slug must be unique.',
            };
        }

        await db('public_pages').insert({
            slug,
            title,
            content,
            is_published: is_published ?? false,
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Page.' };
    }

    revalidatePath('/admin/pages');
    redirect('/admin/pages');
}

export async function updatePage(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = PageSchema.safeParse({
        slug: formData.get('slug'),
        title: formData.get('title'),
        content: formData.get('content'),
        is_published: formData.get('is_published') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Page.',
        };
    }

    const { slug, title, content, is_published } = validatedFields.data;

    try {
        // Check if slug already exists (excluding current page)
        const existing = await db('public_pages')
            .where({ slug })
            .whereNot({ id })
            .first();
        if (existing) {
            return {
                errors: { slug: ['Slug already exists'] },
                message: 'Slug must be unique.',
            };
        }

        await db('public_pages').where({ id }).update({
            slug,
            title,
            content,
            is_published: is_published ?? false,
            updated_at: db.fn.now(),
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Page.' };
    }

    revalidatePath('/admin/pages');
    revalidatePath(`/info/${slug}`);
    redirect('/admin/pages');
}

export async function deletePage(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('public_pages').where({ id }).del();
        revalidatePath('/admin/pages');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Page.' };
    }
}

export async function getPublicPage(slug: string) {
    return await db('public_pages')
        .where({ slug, is_published: true })
        .first();
}
