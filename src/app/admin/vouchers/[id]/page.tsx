import { notFound } from 'next/navigation';
import db from '@/lib/db';
import VoucherForm from '@/components/admin/VoucherForm';
import { getTranslations } from 'next-intl/server';

export default async function VoucherPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('Admin');
    const isNew = id === 'new';

    let voucher = null;

    if (!isNew) {
        voucher = await db('vouchers').where({ id }).first();
        if (!voucher) {
            notFound();
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {isNew ? t('vouchers.createTitle') : t('vouchers.editTitle')}
            </h1>
            <VoucherForm voucher={voucher} />
        </div>
    );
}
