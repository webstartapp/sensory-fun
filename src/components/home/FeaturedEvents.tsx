'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function FeaturedEvents() {
    const t = useTranslations('Home.FeaturedEvents');

    // Dummy Data
    const events = [
        {
            id: 1,
            title: "Sensory Yoga for Kids",
            date: "2023-12-15",
            time: "10:00",
            duration: "60 min",
            price: "250 CZK",
            image: "https://images.unsplash.com/photo-1596464716127-f9a0859b4bce?q=80&w=800&auto=format&fit=crop",
            category: "Kids"
        },
        {
            id: 2,
            title: "Relaxation Hour",
            date: "2023-12-16",
            time: "18:00",
            duration: "90 min",
            price: "350 CZK",
            image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop",
            category: "Adults"
        },
        {
            id: 3,
            title: "Music Therapy Session",
            date: "2023-12-18",
            time: "14:00",
            duration: "45 min",
            price: "300 CZK",
            image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
            category: "Therapy"
        }
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-900">
            <Container>
                <div className="flex items-end justify-between mb-12">
                    <SectionHeading
                        title={t('title')}
                        subtitle={t('subtitle')}
                        className="mb-0"
                    />
                    <Button
                        href="/events"
                        variant="ghost"
                        className="hidden md:flex gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        {t('viewAll')}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Card
                            key={event.id}
                            className="group hover:shadow-xl transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                    {event.category}
                                </div>
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${event.image})` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{event.time} ({event.duration})</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-zinc-700">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {event.price}
                                    </span>
                                    <Button
                                        href={`/events/${event.id}`}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        {t('bookNow')}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Button
                        href="/events"
                        variant="ghost"
                        className="gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        {t('viewAll')}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </Container>
        </section>
    );
}
