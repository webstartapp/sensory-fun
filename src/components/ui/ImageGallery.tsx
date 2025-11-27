'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: Array<{ id: string; data: string }>;
    title?: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (images.length === 0) return null;

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    };

    return (
        <section className="py-12">
            {title && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group cursor-pointer"
                    >
                        <Image
                            src={formatImageSrc(image.data) || ''}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-4">
                        <Image
                            src={formatImageSrc(images[selectedIndex].data) || ''}
                            alt={`Image ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
