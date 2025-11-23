'use server';

import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function reorderItems(table: 'rooms' | 'events' | 'vouchers' | 'banners', items: { id: string; order: number }[]) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        // Use a transaction to ensure all updates succeed
        await db.transaction(async (trx) => {
            for (const item of items) {
                await trx(table).where({ id: item.id }).update({ order: item.order });
            }
        });

        revalidatePath(`/admin/${table}`);
        return { success: true };
    } catch (error) {
        console.error('Reorder error:', error);
        return { message: 'Failed to reorder items' };
    }
}
