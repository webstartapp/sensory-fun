import db from '@/lib/db';
import Container from '@/components/ui/Container';
import { getTranslations } from 'next-intl/server';
import GiftVoucherList from '@/components/home/GiftVoucherList';

export default async function VouchersPage() {
    const t = await getTranslations('VouchersPage');

    const vouchers = await db('vouchers')
        .leftJoin('images', 'vouchers.image_id', 'images.id')
        .select('vouchers.*', 'images.data as image')
        .where('vouchers.is_public', true)
        .orderBy('vouchers.order', 'asc');

    return (
        <div className="py-24">
            <Container>
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <GiftVoucherList vouchers={vouchers} />
            </Container>
        </div>
    );
}
