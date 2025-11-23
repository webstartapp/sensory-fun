'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';

const EventSchema = z.object({
    room_id: z.string().uuid("Room is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    duration_minutes: z.coerce.number().optional(),
    order: z.coerce.number().optional(),
    is_public: z.coerce.boolean().optional(),
    is_featured: z.coerce.boolean().optional(),
    type: z.enum(["single", "repeating", "campaign"]),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    repeat_days: z.string().optional(),
    repeat_time: z.string().optional().nullable(),
});

export async function createEvent(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const repeatDays = formData.getAll('repeat_days').map(d => parseInt(d.toString()));

    const validatedFields = EventSchema.safeParse({
        room_id: formData.get('room_id'),
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        duration_minutes: formData.get('duration_minutes'),
        order: formData.get('order'),
        is_public: formData.get('is_public') === 'on',
        is_featured: formData.get('is_featured') === 'on',
        type: formData.get('type'),
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
        repeat_time: formData.get('repeat_time') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Event.',
        };
    }

    const {
        room_id, name, description, price, duration_minutes, order,
        is_public, is_featured, type, start_date, end_date, repeat_time
    } = validatedFields.data;

    const imageData = formData.get('image') as string;
    let imageId = null;

    try {
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        }

        await db('events').insert({
            room_id,
            name,
            description,
            price,
            duration_minutes: duration_minutes || null,
            order: order || 0,
            is_public: is_public ?? true,
            is_featured: is_featured ?? false,
            type,
            start_date: start_date ? new Date(start_date) : null,
            end_date: end_date ? new Date(end_date) : null,
            repeat_days: JSON.stringify(repeatDays),
            repeat_time: repeat_time || null,
            image_id: imageId,
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Event.' };
    }

    revalidatePath('/admin/events');
    redirect('/admin/events');
}

export async function updateEvent(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const repeatDays = formData.getAll('repeat_days').map(d => parseInt(d.toString()));

    const validatedFields = EventSchema.safeParse({
        room_id: formData.get('room_id'),
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        duration_minutes: formData.get('duration_minutes'),
        order: formData.get('order'),
        is_public: formData.get('is_public') === 'on',
        is_featured: formData.get('is_featured') === 'on',
        type: formData.get('type'),
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
        repeat_time: formData.get('repeat_time') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Event.',
        };
    }

    const {
        room_id, name, description, price, duration_minutes, order,
        is_public, is_featured, type, start_date, end_date, repeat_time
    } = validatedFields.data;

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
            room_id,
            name,
            description,
            price,
            duration_minutes: duration_minutes || null,
            order: order || 0,
            is_public: is_public ?? true,
            is_featured: is_featured ?? false,
            type,
            start_date: start_date ? new Date(start_date) : null,
            end_date: end_date ? new Date(end_date) : null,
            repeat_days: JSON.stringify(repeatDays),
            repeat_time: repeat_time || null,
            updated_at: db.fn.now(),
        };

        if (imageId !== undefined) {
            updateData.image_id = imageId;
        }

        await db('events').where({ id }).update(updateData);
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Event.' };
    }

    revalidatePath('/admin/events');
    redirect('/admin/events');
}

export async function deleteEvent(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('events').where({ id }).del();
        revalidatePath('/admin/events');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Event.' };
    }
}
