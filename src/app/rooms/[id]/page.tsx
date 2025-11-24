import db from '@/lib/db';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, Banknote } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { formatImageSrc } from '@/lib/utils';

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('RoomDetails');

    const room = await db('rooms')
        .leftJoin('images', 'rooms.image_id', 'images.id')
        .select('rooms.*', 'images.data as image')
        .where('rooms.id', id)
        .andWhere('rooms.is_active', true)
        .andWhere('rooms.is_public', true)
        .first();

    if (!room) {
        notFound();
    }

    return (
        <div className="pb-24">
            {/* Hero Section with Image */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
                {room.image ? (
                    <Image
                        src={formatImageSrc(room.image) || ''}
                        alt={room.name}
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
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {room.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-200 text-lg">
                            <MapPin className="w-5 h-5" />
                            <span>{room.location || 'Unknown Location'}</span>
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
                                <p>{room.description}</p>
                            </div>
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
                                        <Users className="w-5 h-5" />
                                        <span>{t('capacity')}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {room.capacity} {t('people')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Banknote className="w-5 h-5" />
                                        <span>{t('price')}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {room.price} Kč / {t('hour')}
                                    </span>
                                </div>
                            </div>

                            <Button
                                href={`/booking?roomId=${room.id}`} // Placeholder for now
                                variant="primary"
                                fullWidth
                                size="lg"
                            >
                                {t('bookNow')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
