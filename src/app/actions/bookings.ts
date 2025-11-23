'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import { auth } from '@/auth';

export async function approveBooking(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('bookings').where({ id }).update({
            status: 'accepted',
            updated_at: db.fn.now(),
        });
        revalidatePath('/admin/bookings');
    } catch (error) {
        return { message: 'Database Error: Failed to Approve Booking.' };
    }
}

export async function declineBooking(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await db('bookings').where({ id }).update({
            status: 'declined',
            updated_at: db.fn.now(),
        });
        revalidatePath('/admin/bookings');
    } catch (error) {
        return { message: 'Database Error: Failed to Decline Booking.' };
    }
}
