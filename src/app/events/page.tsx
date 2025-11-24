import db from '@/lib/db';
import Container from '@/components/ui/Container';
import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { formatImageSrc } from '@/lib/utils';

export default async function EventsPage() {
    const t = await getTranslations('EventsPage');

    const events = await db('events')
        .leftJoin('images', 'events.image_id', 'images.id')
        .select('events.*', 'images.data as image')
        .where('events.is_active', true)
        .andWhere('events.is_public', true)
        .orderBy('events.start_date', 'asc');

    return (
        <div className="py-24">
            <Container>
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        {t('noEvents')}
                    </div>
                )}
            </Container>
        </div>
    );
}

function EventCard({ event }: { event: any }) {
    const startDate = event.start_date ? new Date(event.start_date) : null;
    const endDate = event.end_date ? new Date(event.end_date) : null;

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                {event.image ? (
                    <Image
                        src={formatImageSrc(event.image) || ''}
                        alt={event.title || event.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {/* Date Badge */}
                {startDate && (
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                        {format(startDate, 'd. MMMM', { locale: cs })}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title || event.name}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {startDate && endDate && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location || 'Unknown Location'}</span>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm grow">
                    {event.description}
                </p>

                <Button
                    href={`/events/${event.id}`}
                    variant="outline"
                    fullWidth
                    className="group mt-auto"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </Card>
    );
}
