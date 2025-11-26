import db from '@/lib/db';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import VoucherBookingForm from '@/components/booking/VoucherBookingForm';
import { getTranslations } from 'next-intl/server';

export default async function VoucherBuyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('VoucherDetails');

    const voucher = await db('vouchers')
        .where('id', id)
        .first();

    if (!voucher) {
        notFound();
    }

    return (
        <Container className="py-12">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{voucher.name}</h1>
                    <div className="text-gray-600 dark:text-gray-400">
                        <p>{voucher.price} Kč</p>
                        <p>Platnost: {voucher.validity_days} dní</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
                    <VoucherBookingForm voucher={voucher} />
                </div>
            </div>
        </Container>
    );
}
