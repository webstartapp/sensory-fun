'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';

const BannerSchema = z.object({
    title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or less"),
    subtitle: z.string().min(1, "Subtitle is required").max(100, "Subtitle must be 100 characters or less"),
    button_text: z.string().min(1, "Button text is required").max(20, "Button text must be 20 characters or less"),
    type: z.enum(["room", "event", "voucher", "link"]),
    link: z.string().optional().nullable(),
    room_id: z.string().optional().nullable(),
    event_id: z.string().optional().nullable(),
    voucher_id: z.string().optional().nullable(),
    is_active: z.coerce.boolean().optional(),
});

export async function createBanner(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = BannerSchema.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        button_text: formData.get('button_text'),
        type: formData.get('type'),
        link: formData.get('link') || null,
        room_id: formData.get('room_id') || null,
        event_id: formData.get('event_id') || null,
        voucher_id: formData.get('voucher_id') || null,
        is_active: formData.get('is_active') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Banner.',
        };
    }

    const {
        title, subtitle, button_text, type, link, room_id, event_id, voucher_id, is_active
    } = validatedFields.data;

    // Validation based on type
    if (type === 'room' && !room_id) return { message: 'Room is required for Room banner type.' };
    if (type === 'event' && !event_id) return { message: 'Event is required for Event banner type.' };
    if (type === 'voucher' && !voucher_id) return { message: 'Voucher is required for Voucher banner type.' };
    if (type === 'link' && !link) return { message: 'Link is required for Link banner type.' };

    const imageData = formData.get('image') as string;
    let imageId = null;

    try {
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        }

        await db('banners').insert({
            title,
            subtitle,
            button_text,
            type,
            link,
            room_id,
            event_id,
            voucher_id,
            is_active: is_active ?? true,
            image_id: imageId,
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Banner.' };
    }

    revalidatePath('/admin/banners');
    redirect('/admin/banners');
}

export async function updateBanner(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = BannerSchema.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        button_text: formData.get('button_text'),
        type: formData.get('type'),
        link: formData.get('link') || null,
        room_id: formData.get('room_id') || null,
        event_id: formData.get('event_id') || null,
        voucher_id: formData.get('voucher_id') || null,
        is_active: formData.get('is_active') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Banner.',
        };
    }

    const {
        title, subtitle, button_text, type, link, room_id, event_id, voucher_id, is_active
    } = validatedFields.data;

    // Validation based on type
    if (type === 'room' && !room_id) return { message: 'Room is required for Room banner type.' };
    if (type === 'event' && !event_id) return { message: 'Event is required for Event banner type.' };
    if (type === 'voucher' && !voucher_id) return { message: 'Voucher is required for Voucher banner type.' };
    if (type === 'link' && !link) return { message: 'Link is required for Link banner type.' };

    const imageData = formData.get('image') as string;

    try {
        let imageId = undefined;
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        } else if (imageData === '') {
            imageId = null;
        }

        const updateData: any = {
            title,
            subtitle,
            button_text,
            type,
            link,
            room_id,
            event_id,
            voucher_id,
            is_active: is_active ?? true,
            updated_at: db.fn.now(),
        };

        if (imageId !== undefined) {
            updateData.image_id = imageId;
        }

        await db('banners').where({ id }).update(updateData);
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Banner.' };
    }

    revalidatePath('/admin/banners');
    redirect('/admin/banners');
}

export async function deleteBanner(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('banners').where({ id }).del();
        revalidatePath('/admin/banners');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Banner.' };
    }
}
