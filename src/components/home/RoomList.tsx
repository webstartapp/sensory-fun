'use client';

import { useTranslations } from 'next-intl';
import { MapPin, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';

export default function RoomList({ rooms = [] }: { rooms: any[] }) {
    const t = useTranslations('Home.RoomList');

    if (rooms.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-black">
            <Container>
                <SectionHeading
                    title={t('title')}
                    subtitle={t('subtitle')}
                    align="center"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <Card key={room.id} className="group hover:shadow-xl transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                {room.image ? (
                                    <Image
                                        src={room.image}
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
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {room.name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{room.location || 'Unknown Location'}</span>
                                </div>

                                <Button
                                    href={`/rooms/${room.id}`}
                                    variant="outline"
                                    fullWidth
                                    className="group"
                                >
                                    {t('viewDetails')}
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
