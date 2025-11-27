'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';

const VoucherSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    validity_days: z.coerce.number().min(1),
    capacity: z.coerce.number().optional(),
    order: z.coerce.number().optional(),
    is_active: z.coerce.boolean().optional(),
    is_public: z.coerce.boolean().optional(),
    is_featured: z.coerce.boolean().optional(),
});

export async function createVoucher(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = VoucherSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        validity_days: formData.get('validity_days'),
        capacity: formData.get('capacity'),
        order: formData.get('order'),
        is_active: formData.get('is_active') === 'on',
        is_public: formData.get('is_public') === 'on',
        is_featured: formData.get('is_featured') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Voucher.',
        };
    }

    const { name, description, price, validity_days, capacity, order, is_active, is_public, is_featured } = validatedFields.data;
    const imageData = formData.get('image') as string;
    let imageId = null;

    try {
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        }

        await db('vouchers').insert({
            name,
            description,
            price,
            validity_days,
            capacity: capacity || null,
            order: order || 0,
            is_active: is_active ?? false,
            is_public: is_public ?? true,
            is_featured: is_featured ?? false,
            image_id: imageId,
        });
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Voucher.' };
    }

    revalidatePath('/admin/vouchers');
    redirect('/admin/vouchers');
}

export async function updateVoucher(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = VoucherSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        validity_days: formData.get('validity_days'),
        capacity: formData.get('capacity'),
        order: formData.get('order'),
        is_active: formData.get('is_active') === 'on',
        is_public: formData.get('is_public') === 'on',
        is_featured: formData.get('is_featured') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Voucher.',
        };
    }

    const { name, description, price, validity_days, capacity, order, is_active, is_public, is_featured } = validatedFields.data;
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
            name,
            description,
            price,
            validity_days,
            capacity: capacity || null,
            order: order || 0,
            is_active: is_active ?? false,
            is_public: is_public ?? true,
            is_featured: is_featured ?? false,
            updated_at: db.fn.now(),
        };

        if (imageId !== undefined) {
            updateData.image_id = imageId;
        }

        await db('vouchers').where({ id }).update(updateData);
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Voucher.' };
    }

    revalidatePath('/admin/vouchers');
    redirect('/admin/vouchers');
}

export async function deleteVoucher(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('vouchers').where({ id }).del();
        revalidatePath('/admin/vouchers');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Voucher.' };
    }
}

export async function getVouchersByRoom(roomId: string, limit?: number) {
    let query = db('vouchers')
        .join('voucher_rooms', 'vouchers.id', 'voucher_rooms.voucher_id')
        .leftJoin('images', 'vouchers.image_id', 'images.id')
        .select('vouchers.*', 'images.data as image')
        .where('voucher_rooms.room_id', roomId)
        .where('vouchers.is_public', true)
        .where('vouchers.is_active', true)
        .orderBy('vouchers.order', 'asc');

    if (limit) {
        query = query.limit(limit);
    }

    return await query;
}
