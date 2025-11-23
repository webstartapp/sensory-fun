import Link from 'next/link';
import { Plus } from 'lucide-react';
import db from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';
import RoomsList from '@/components/admin/RoomsList';

export default async function AdminRoomsPage() {
    const t = await getTranslations('Admin');
    const rooms = await db('rooms')
        .leftJoin('images', 'rooms.image_id', 'images.id')
        .select('rooms.*', 'images.data as image_data')
        .orderBy('order', 'asc');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('rooms.title')}
                </h1>
                <Link href="/admin/rooms/new">
                    <Button>{t('rooms.create')}</Button>
                </Link>
            </div>

            <RoomsList initialRooms={rooms} />
        </div>
    );
}
