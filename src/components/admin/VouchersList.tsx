'use client';

import { useState } from 'react';
import { reorderItems } from '@/app/actions/reorder';
import SortableList from './SortableList';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import DeleteVoucherButton from './DeleteVoucherButton';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Voucher {
    id: string;
    name: string;
    price: number;
    validity_days: number;
    is_public: boolean;
    is_featured: boolean;
    image_data?: string;
    order: number;
}

export default function VouchersList({ initialVouchers }: { initialVouchers: Voucher[] }) {
    const [vouchers, setVouchers] = useState(initialVouchers);
    const t = useTranslations('Admin');

    const handleReorder = async (newVouchers: Voucher[]) => {
        setVouchers(newVouchers);
        const orderUpdates = newVouchers.map((voucher, index) => ({
            id: voucher.id,
            order: index,
        }));
        await reorderItems('vouchers', orderUpdates);
    };

    const renderItem = (voucher: Voucher) => (
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                    {voucher.image_data ? (
                        <Image
                            src={voucher.image_data}
                            alt={voucher.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{voucher.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {voucher.validity_days} days
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {voucher.price} CZK
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${voucher.is_public
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {voucher.is_public ? 'Public' : 'Hidden'}
                </span>
                <div className="flex space-x-2">
                    <Link href={`/admin/vouchers/${voucher.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Pencil className="h-5 w-5" />
                    </Link>
                    <DeleteVoucherButton id={voucher.id} />
                </div>
            </div>
        </div>
    );

    return (
        <SortableList
            items={vouchers}
            onReorder={handleReorder}
            renderItem={renderItem}
        />
    );
}
