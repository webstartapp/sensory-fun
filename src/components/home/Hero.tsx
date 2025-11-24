'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatImageSrc } from '@/lib/utils';
import Image from 'next/image';

interface BannerData {
    id: string;
    title: string;
    subtitle: string;
    button_text: string;
    image: string;
    type: 'room' | 'event' | 'voucher' | 'link';
    targetId?: string; // roomId or eventId or voucherId
    link?: string;
    room_id?: string;
    event_id?: string;
    voucher_id?: string;
}

export default function Hero({ banners = [] }: { banners: any[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

    const getButtonLink = (banner: BannerData) => {
        if (banner.type === 'room' && banner.room_id) return `/rooms/${banner.room_id}`;
        if (banner.type === 'event' && banner.event_id) return `/events/${banner.event_id}`;
        if (banner.type === 'voucher' && banner.voucher_id) return `/vouchers/${banner.voucher_id}`;
        if (banner.type === 'link') return banner.link || '#';
        return null;
    };

    if (banners.length === 0) {
        return (
            <div className="h-[600px] w-full bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">No Banners Found</h1>
                    <p>Please add banners in the Admin Dashboard.</p>
                </div>
            </div>
        );
    }

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
                        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/90 z-10" />
                        {banner.image && (
                            <Image
                                src={formatImageSrc(banner.image) || ''}
                                alt={banner.title}
                                fill
                                className={`object-cover ${index === currentSlide ? 'animate-ken-burns' : ''}`}
                                priority={index === 0}
                            />
                        )}
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
                                        variant="ghost"
                                        className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all hover:scale-105 shadow-lg"
                                    >
                                        {banner.button_text}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            {banners.length > 1 && (
                <>
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
                </>
            )}

            {/* Dots */}
            {banners.length > 1 && (
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
            )}
        </div>
    );
}
