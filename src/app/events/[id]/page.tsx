import db from '@/lib/db';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, Clock, Banknote, Calendar, Edit } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { formatImageSrc } from '@/lib/utils';
import { auth } from '@/auth';
import EventBookingCard from '@/components/events/EventBookingCard';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('EventDetails');
    const session = await auth();

    const event = await db('events')
        .leftJoin('images', 'events.image_id', 'images.id')
        .join('rooms', 'events.room_id', 'rooms.id')
        .select('events.*', 'images.data as image', 'rooms.capacity')
        .where('events.id', id)
        .andWhere('events.is_active', true)
        .andWhere('events.is_public', true)
        .first();

    if (!event) {
        notFound();
    }

    const startDate = event.start_date ? new Date(event.start_date) : null;
    const endDate = event.end_date ? new Date(event.end_date) : null;

    return (
        <div className="pb-24">
            {/* Hero Section with Image */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
                {event.image ? (
                    <Image
                        src={formatImageSrc(event.image) || ''}
                        alt={event.title}
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
                                {event.type === 'single' && startDate && (
                                    <div className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                                        {format(startDate, 'd. MMMM yyyy', { locale: cs })}
                                    </div>
                                )}
                                {event.type === 'repeating' && startDate && (
                                    <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                                        {t('validFrom')} {format(startDate, 'd. MMMM yyyy', { locale: cs })}
                                    </div>
                                )}
                                {event.type === 'campaign' && startDate && (
                                    <div className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                                        {format(startDate, 'd. M. yyyy', { locale: cs })}
                                        {endDate && ` - ${format(endDate, 'd. M. yyyy', { locale: cs })}`}
                                    </div>
                                )}
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                    {event.title}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-200 text-lg">
                                    <MapPin className="w-5 h-5" />
                                    <span>{event.location || 'Unknown Location'}</span>
                                </div>
                            </div>
                            {session?.user?.role === 'admin' && (
                                <Button
                                    href={`/admin/events/${event.id}/edit`}
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
                                <p>{event.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info Card */}
                    <div className="lg:col-span-1">
                        <EventBookingCard event={event} />
                    </div>
                </div>
            </Container>
        </div>
    );
}
