'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';

const RoomSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    capacity: z.coerce.number().optional(),
    is_active: z.coerce.boolean().optional(),
    is_public: z.coerce.boolean().optional(),
    order: z.coerce.number().optional(),
});

export async function createRoom(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = RoomSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        location: formData.get('location'),
        capacity: formData.get('capacity'),
        is_active: formData.get('is_active') === 'on',
        is_public: formData.get('is_public') === 'on',
        order: formData.get('order'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Room.',
        };
    }

    const { name, description, location, capacity, is_active, is_public, order } = validatedFields.data;
    const imageData = formData.get('image') as string;
    let imageId = null;

    try {
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        }

        await db('rooms').insert({
            name,
            description,
            location,
            capacity: capacity || null,
            is_active: is_active ?? true,
            is_public: is_public ?? true,
            order: order || 0,
            image_id: imageId,
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Room.' };
    }

    revalidatePath('/admin/rooms');
    redirect('/admin/rooms');
}

export async function updateRoom(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = RoomSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        location: formData.get('location'),
        capacity: formData.get('capacity'),
        is_active: formData.get('is_active') === 'on',
        is_public: formData.get('is_public') === 'on',
        order: formData.get('order'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Room.',
        };
    }

    const { name, description, location, capacity, is_active, is_public, order } = validatedFields.data;
    const imageData = formData.get('image') as string;

    try {
        let imageId = undefined;
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        } else if (imageData === '') {
            // If empty string, it might mean remove image? 
            // Or if it's null/undefined, we keep existing.
            // Our ImageUpload component sends '' when removed.
            imageId = null;
        }

        const updateData: any = {
            name,
            description,
            location,
            capacity: capacity || null,
            is_active: is_active ?? true,
            is_public: is_public ?? true,
            order: order || 0,
            updated_at: db.fn.now(),
        };

        if (imageId !== undefined) {
            updateData.image_id = imageId;
        }

        await db('rooms').where({ id }).update(updateData);
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Room.' };
    }

    revalidatePath('/admin/rooms');
    redirect('/admin/rooms');
}

export async function deleteRoom(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('rooms').where({ id }).del();
        revalidatePath('/admin/rooms');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Room.' };
    }
}
