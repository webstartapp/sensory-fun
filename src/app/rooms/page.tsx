import db from '@/lib/db';
import Container from '@/components/ui/Container';
import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MapPin, ArrowRight } from 'lucide-react';
import { formatImageSrc } from '@/lib/utils';

export default async function RoomsPage() {
    const t = await getTranslations('RoomsPage');

    const rooms = await db('rooms')
        .leftJoin('images', 'rooms.image_id', 'images.id')
        .select('rooms.*', 'images.data as image')
        .where('rooms.is_active', true)
        .andWhere('rooms.is_public', true)
        .orderBy('rooms.order', 'asc');

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
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </Container>
        </div>
    );
}

function RoomCard({ room }: { room: any }) {
    return (
        <Card className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                {room.image ? (
                    <Image
                        src={formatImageSrc(room.image) || ''}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {room.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{room.location || 'Unknown Location'}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm grow">
                    {room.description}
                </p>

                <Button
                    href={`/rooms/${room.id}`}
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
