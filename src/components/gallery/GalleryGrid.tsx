'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import ImageGallery from '@/components/ui/ImageGallery';

interface GalleryImage {
    id: string;
    data: string;
    galleries?: { id: string; name: string }[];
}

interface GalleryCollection {
    id: string;
    name: string;
}

interface GalleryGridProps {
    images: GalleryImage[];
    collections: GalleryCollection[];
}

export default function GalleryGrid({ images, collections }: GalleryGridProps) {
    const t = useTranslations('GalleryPage');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const filteredImages = activeFilter === 'all'
        ? images
        : images.filter(img => img.galleries?.some(g => g.id === activeFilter));

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                        }`}
                >
                    {t('all')}
                </button>
                {collections.map(collection => (
                    <button
                        key={collection.id}
                        onClick={() => setActiveFilter(collection.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === collection.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                            }`}
                    >
                        {collection.name}
                    </button>
                ))}
            </div>

            {/* Image Gallery Component */}
            {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t('noImages')}</p>
                </div>
            ) : (
                <ImageGallery images={filteredImages} />
            )}
        </div>
    );
}
