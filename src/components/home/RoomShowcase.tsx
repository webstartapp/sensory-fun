'use client';

import { useTranslations } from 'next-intl';
import { Users, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function RoomShowcase() {
    const t = useTranslations('Home.RoomShowcase');

    const rooms = [
        {
            id: 1,
            name: "Ocean Room",
            description: "Dive into a calming underwater world. Perfect for relaxation and sensory regulation with gentle blue lights and bubble tubes.",
            capacity: "4-6 people",
            image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
            features: ["Bubble Tubes", "Fiber Optics", "Water Bed"]
        },
        {
            id: 2,
            name: "Forest Adventure",
            description: "Explore the textures and sounds of nature. An active space designed for tactile exploration and gross motor skills.",
            capacity: "8-10 people",
            image: "https://images.unsplash.com/photo-1596464716127-f9a0859b4bce?q=80&w=800&auto=format&fit=crop",
            features: ["Tactile Walls", "Swing", "Soft Play Area"]
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-black overflow-hidden">
            <Container>
                <SectionHeading
                    title={t('title')}
                    subtitle={t('subtitle')}
                    align="center"
                    className="mb-16"
                />

                <div className="space-y-24">
                    {rooms.map((room, index) => (
                        <div
                            key={room.id}
                            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-300" />
                                <div
                                    className="relative h-[400px] w-full rounded-3xl bg-cover bg-center shadow-2xl overflow-hidden"
                                    style={{ backgroundImage: `url(${room.image})` }}
                                >
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {room.name}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {room.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {room.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 pt-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Users className="w-5 h-5" />
                                        <span>{room.capacity}</span>
                                    </div>
                                    <Button
                                        href={`/rooms/${room.id}`}
                                        variant="ghost"
                                        className="gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 group"
                                    >
                                        {t('viewDetails')}
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
