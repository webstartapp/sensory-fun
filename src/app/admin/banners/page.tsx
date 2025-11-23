import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import db from '@/lib/db';
import BannersList from '@/components/admin/BannersList';

export default async function AdminBannersPage() {
    const t = await getTranslations('Admin.banners');
    const banners = await db('banners')
        .leftJoin('images', 'banners.image_id', 'images.id')
        .select('banners.*', 'images.data as image_data')
        .orderBy('order', 'asc');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                </h1>
                <Link href="/admin/banners/new">
                    <Button>{t('create')}</Button>
                </Link>
            </div>

            <BannersList initialBanners={banners} />
        </div>
    );
}
