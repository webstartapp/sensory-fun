import { notFound } from 'next/navigation';
import db from '@/lib/db';
import RoomForm from '@/components/admin/RoomForm';
import { getTranslations } from 'next-intl/server';

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('Admin');
    const isNew = id === 'new';

    let room = null;

    if (!isNew) {
        room = await db('rooms').where({ id }).first();
        if (!room) {
            notFound();
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {isNew ? t('rooms.createTitle') : t('rooms.editTitle')}
            </h1>
            <RoomForm room={room} />
        </div>
    );
}
