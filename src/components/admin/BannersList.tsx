'use client';

import { useState } from 'react';
import { reorderItems } from '@/app/actions/reorder';
import SortableList from './SortableList';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import DeleteBannerButton from './DeleteBannerButton';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Banner {
    id: string;
    title: string;
    type: string;
    is_active: boolean;
    image_data?: string;
    order: number;
}

export default function BannersList({ initialBanners }: { initialBanners: Banner[] }) {
    const [banners, setBanners] = useState(initialBanners);
    const t = useTranslations('Admin.banners');

    const handleReorder = async (newBanners: Banner[]) => {
        setBanners(newBanners);
        const orderUpdates = newBanners.map((banner, index) => ({
            id: banner.id,
            order: index,
        }));
        await reorderItems('banners', orderUpdates);
    };

    const renderItem = (banner: Banner) => (
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
                <div className="relative h-12 w-24 rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    {banner.image_data ? (
                        <Image
                            src={banner.image_data}
                            alt={banner.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{banner.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {banner.type}
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                    <Link href={`/admin/banners/${banner.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Pencil className="h-5 w-5" />
                    </Link>
                    <DeleteBannerButton id={banner.id} />
                </div>
            </div>
        </div>
    );

    return (
        <SortableList
            items={banners}
            onReorder={handleReorder}
            renderItem={renderItem}
        />
    );
}
