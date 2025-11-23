'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BannerData {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    type: 'room' | 'event' | 'link';
    targetId?: string | number; // roomId or eventId
    link?: string;
    isActive?: boolean; // for rooms/events
}

export default function Hero() {
    const t = useTranslations('Home.Hero');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Dummy Data matching acceptance criteria
    const banners: BannerData[] = [
        {
            id: 1,
            title: "Objevte svět smyslové zábavy", // Max 50 chars
            subtitle: "Unikátní prostory navržené pro relaxaci, rozvoj a radost.", // Max 100 chars
            buttonText: "Prozkoumat místnosti", // Max 20 chars
            image: "/image-gallery/b753cc9c-b311-490c-90fd-98b68b5a207a",
            type: 'link',
            link: '/rooms'
        },
        {
            id: 2,
            title: "Sensory Yoga for Kids",
            subtitle: "Speciální lekce jógy zaměřená na smyslový rozvoj dětí.",
            buttonText: "Zobrazit akci",
            image: "/image-gallery/d8820db9-9e72-4731-bc3d-011a477fc07b",
            type: 'event',
            targetId: 1,
            isActive: true
        },
        {
            id: 3,
            title: "Ocean Room",
            subtitle: "Ponořte se do uklidňujícího podmořského světa.",
            buttonText: "Detail místnosti",
            image: "/image-gallery/7e94e0bd-98ae-461b-ab40-8635f2c68ef7",
            type: 'room',
            targetId: 1,
            isActive: true
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

    const getButtonLink = (banner: BannerData) => {
        if (banner.type === 'room' && banner.isActive) return `/rooms/${banner.targetId}`;
        if (banner.type === 'event' && banner.isActive) return `/events/${banner.targetId}`;
        if (banner.type === 'link') return banner.link || '#';
        return null;
    };

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-black">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 z-10" />
                        <div
                            className={`w-full h-full bg-cover bg-center ${index === currentSlide ? 'animate-ken-burns' : ''}`}
                            style={{ backgroundImage: `url(${banner.image})` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl space-y-8">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                                {banner.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                                {banner.subtitle}
                            </p>

                            {getButtonLink(banner) && (
                                <div className="flex justify-center gap-4">
                                    <Button
                                        href={getButtonLink(banner)!}
                                        size="lg"
                                        className="bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black"
                                    >
                                        {banner.buttonText}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
