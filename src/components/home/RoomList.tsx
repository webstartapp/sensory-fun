'use client';

import { useTranslations } from 'next-intl';
import { MapPin, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function RoomList() {
    const t = useTranslations('Home.RoomList');

    // Dummy Data
    const rooms = [
        {
            id: 1,
            name: "Ocean Room",
            location: "1. Patro, Místnost A",
            image: "/image-gallery/7e94e0bd-98ae-461b-ab40-8635f2c68ef7",
        },
        {
            id: 2,
            name: "Forest Adventure",
            location: "1. Patro, Místnost B",
            image: "/image-gallery/b753cc9c-b311-490c-90fd-98b68b5a207a",
        },
        {
            id: 3,
            name: "Cosmic Space",
            location: "2. Patro, Místnost C",
            image: "/image-gallery/52cecaa9-1583-40ee-b3a6-d6737561b09e",
        }
    ];

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
                            <div className="relative h-64 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${room.image})` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {room.name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{room.location}</span>
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
