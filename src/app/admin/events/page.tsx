import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import db from '@/lib/db';
import EventsList from '@/components/admin/EventsList';

export default async function AdminEventsPage() {
    const t = await getTranslations('Admin');
    const events = await db('events')
        .leftJoin('rooms', 'events.room_id', 'rooms.id')
        .leftJoin('images', 'events.image_id', 'images.id')
        .select(
            'events.*',
            'rooms.name as room_name',
            'images.data as image_data'
        )
        .orderBy('events.order', 'asc');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('events.title')}
                </h1>
                <Link href="/admin/events/new">
                    <Button>{t('events.create')}</Button>
                </Link>
            </div>

            <EventsList initialEvents={events} />
        </div>
    );
}
