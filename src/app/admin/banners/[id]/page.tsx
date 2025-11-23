import { notFound } from 'next/navigation';
import db from '@/lib/db';
import BannerForm from '@/components/admin/BannerForm';
import { getTranslations } from 'next-intl/server';

export default async function BannerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('Admin.banners');
    const isNew = id === 'new';

    let banner = null;

    if (!isNew) {
        banner = await db('banners')
            .leftJoin('images', 'banners.image_id', 'images.id')
            .select('banners.*', 'images.data as image_data')
            .where('banners.id', id)
            .first();

        if (!banner) {
            notFound();
        }
    }

    // Fetch options for dropdowns
    const rooms = await db('rooms').select('id', 'name').orderBy('name');
    const events = await db('events').select('id', 'name').orderBy('name');
    const vouchers = await db('vouchers').select('id', 'name').orderBy('name');

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {isNew ? t('createTitle') : t('editTitle')}
            </h1>
            <BannerForm
                banner={banner}
                rooms={rooms}
                events={events}
                vouchers={vouchers}
            />
        </div>
    );
}
