'use client';

import { deleteBanner } from '@/app/actions/banners';
import { Trash2 } from 'lucide-react';

export default function DeleteBannerButton({ id }: { id: string }) {
    return (
        <button
            onClick={async () => {
                if (confirm('Are you sure you want to delete this banner?')) {
                    await deleteBanner(id);
                }
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
            <Trash2 className="h-5 w-5" />
        </button>
    );
}
