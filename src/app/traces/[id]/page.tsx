import { getTraceById } from '@/app/actions/traces';
import { getImagesByEntity } from '@/app/actions/images';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import ImageGallery from '@/components/ui/ImageGallery';
import RoomList from '@/components/home/RoomList';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import db from '@/lib/db';

export default async function TraceDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;
    const t = await getTranslations('Traces');

    const trace = await getTraceById(id);

    if (!trace) {
        notFound();
    }

    // Get images directly assigned to this trace
    const traceImages = await getImagesByEntity('trace', id);

    // Get rooms that use this trace
    const rooms = await db('rooms')
        .join('rooms_traces', 'rooms.id', 'rooms_traces.room_id')
        .leftJoin('images', 'rooms.image_id', 'images.id')
        .select('rooms.*', 'images.data as image')
        .where('rooms_traces.trace_id', id)
        .andWhere('rooms.is_active', true)
        .andWhere('rooms.is_public', true);

    // Get events that use this trace
    const events = await db('events')
        .join('events_traces', 'events.id', 'events_traces.event_id')
        .leftJoin('images', 'events.image_id', 'images.id')
        .select('events.*', 'images.data as image')
        .where('events_traces.trace_id', id)
        .andWhere('events.is_active', true)
        .andWhere('events.is_public', true);

    return (
        <div className="min-h-screen pb-24">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
                {trace.image ? (
                    <Image
                        src={formatImageSrc(trace.image) || ''}
                        alt={trace.name}
                        fill
                        className="object-cover opacity-70"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <Container>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {trace.name}
                        </h1>
                    </Container>
                </div>
            </div>

            <Container className="py-12">
                {/* Description */}
                {trace.description && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('details')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            {trace.description}
                        </p>
                    </div>
                )}

                {/* Image Gallery */}
                {traceImages.length > 0 && (
                    <ImageGallery images={traceImages} title={t('gallery')} />
                )}

                {/* Rooms with this trace */}
                {rooms.length > 0 && (
                    <div className="mt-12">
                        <RoomList
                            rooms={rooms}
                            title={t('roomsWithTrace')}
                            subtitle=""
                        />
                    </div>
                )}

                {/* Events with this trace */}
                {events.length > 0 && (
                    <div className="mt-12">
                        <FeaturedEvents
                            events={events}
                            title={t('eventsWithTrace')}
                            subtitle=""
                        />
                    </div>
                )}
            </Container>
        </div>
    );
}
