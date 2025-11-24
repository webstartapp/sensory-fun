import { notFound } from 'next/navigation';
import db from '@/lib/db';
import EventForm from '@/components/admin/EventForm';
import { getTranslations } from 'next-intl/server';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('Admin');
    const isNew = id === 'new';

    let event = null;
    const rooms = await db('rooms').select('id', 'name').orderBy('name', 'asc');

    if (!isNew) {
        event = await db('events')
            .leftJoin('images', 'events.image_id', 'images.id')
            .select('events.*', 'images.data as image_data')
            .where('events.id', id)
            .first();

        if (!event) {
            notFound();
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {isNew ? t('events.createTitle') : t('events.editTitle')}
            </h1>
            <EventForm event={event} rooms={rooms} />
        </div>
    );
}
