import db from '@/lib/db';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, Banknote, Edit } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { formatImageSrc } from '@/lib/utils';
import { auth } from '@/auth';

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('RoomDetails');
    const session = await auth();

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

    const events = await db('events')
        .leftJoin('images', 'events.image_id', 'images.id')
        .select('events.*', 'images.data as image')
        .where('events.room_id', id)
        .andWhere('events.is_active', true)
        .andWhere('events.is_public', true)
        .orderBy('events.start_date', 'asc');

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
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                    {room.name}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-200 text-lg">
                                    <MapPin className="w-5 h-5" />
                                    <span>{room.location || 'Unknown Location'}</span>
                                </div>
                            </div>
                            {session?.user?.role === 'admin' && (
                                <Button
                                    href={`/admin/rooms/${room.id}/edit`}
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
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('about')}
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p>{room.description}</p>
                            </div>
                        </div>

                        {/* Events List */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Nadcházející akce v této místnosti
                            </h2>
                            {events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {events.map((event) => (
                                        <div key={event.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                                            <div className="relative h-40">
                                                {event.image ? (
                                                    <Image
                                                        src={formatImageSrc(event.image) || ''}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col grow">
                                                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                                <div className="text-sm text-gray-500 mb-4 space-y-1">
                                                    {event.start_date && (
                                                        <p>Datum: {new Date(event.start_date).toLocaleDateString('cs-CZ')}</p>
                                                    )}
                                                    <p>Cena: {event.price} Kč</p>
                                                </div>
                                                <Button
                                                    href={`/events/${event.id}/book`}
                                                    variant="primary"
                                                    fullWidth
                                                    size="sm"
                                                    className="mt-auto"
                                                >
                                                    Rezervovat
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">V této místnosti momentálně nejsou naplánovány žádné akce.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {t('details')}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Users className="w-5 h-5" />
                                        <span>{t('capacity')}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {room.capacity} {t('people')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('location')}
                                </h3>
                                <div className="rounded-xl overflow-hidden h-48 w-full bg-gray-100 dark:bg-zinc-800 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(room.location || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
