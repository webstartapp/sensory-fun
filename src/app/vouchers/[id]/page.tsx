import db from '@/lib/db';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Banknote, Gift, Edit } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { formatImageSrc } from '@/lib/utils';
import { auth } from '@/auth';
import RoomList from '@/components/home/RoomList';
import { getRoomsByVoucher } from '@/app/actions/rooms';

export default async function VoucherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('VoucherDetails');
    const tRelated = await getTranslations('RelatedContent');
    const session = await auth();

    const voucher = await db('vouchers')
        .leftJoin('images', 'vouchers.image_id', 'images.id')
        .select('vouchers.*', 'images.data as image')
        .where('vouchers.id', id)
        .andWhere('vouchers.is_public', true)
        .first();

    if (!voucher) {
        notFound();
    }

    const rooms = await getRoomsByVoucher(id);

    return (
        <div className="pb-24">
            {/* Hero Section with Image */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
                {voucher.image ? (
                    <Image
                        src={formatImageSrc(voucher.image) || ''}
                        alt={voucher.name}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        No Image Available
                    </div>
                )}
                <div className="absolute inset-0 flex items-end pb-16">
                    <Container>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                                    <Gift className="w-4 h-4" />
                                    <span>Dárkový Poukaz</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                    {voucher.name}
                                </h1>
                            </div>
                            {session?.user?.role === 'admin' && (
                                <Button
                                    href={`/admin/vouchers/${voucher.id}/edit`}
                                    variant="secondary"
                                    className="mb-2"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Upravit
                                </Button>
                            )}
                        </div>
                    </Container>
                </div>
            </div>

            <Container className="mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('about')}
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p>{voucher.description}</p>
                            </div>
                        </div>

                        {/* Related Rooms */}
                        <div>
                            <RoomList
                                rooms={rooms}
                                title={tRelated('roomsForVoucher')}
                                subtitle=" "
                            />
                        </div>
                    </div>

                    {/* Sidebar / Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {t('details')}
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Banknote className="w-5 h-5" />
                                        <span>{t('price')}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {voucher.price} Kč
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Gift className="w-5 h-5" />
                                        <span>{t('validity')}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {voucher.validity_days} {t('days')}
                                    </span>
                                </div>
                            </div>

                            <Button
                                href={`/vouchers/${voucher.id}/buy`}
                                variant="primary"
                                fullWidth
                                size="lg"
                            >
                                {t('buyNow')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
