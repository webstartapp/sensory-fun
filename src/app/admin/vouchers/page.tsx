import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import db from '@/lib/db';
import VouchersList from '@/components/admin/VouchersList';

export default async function AdminVouchersPage() {
    const t = await getTranslations('Admin');
    const vouchers = await db('vouchers')
        .leftJoin('images', 'vouchers.image_id', 'images.id')
        .select('vouchers.*', 'images.data as image_data')
        .orderBy('order', 'asc');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('vouchers.title')}
                </h1>
                <Link href="/admin/vouchers/new">
                    <Button>{t('vouchers.create')}</Button>
                </Link>
            </div>

            <VouchersList initialVouchers={vouchers} />
        </div>
    );
}
