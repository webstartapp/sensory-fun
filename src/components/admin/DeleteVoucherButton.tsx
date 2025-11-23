'use client';

import { Trash2 } from 'lucide-react';
import { deleteVoucher } from '@/app/actions/vouchers';
import { useTransition } from 'react';

export default function DeleteVoucherButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this voucher?')) {
            startTransition(async () => {
                await deleteVoucher(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
        >
            <Trash2 className="h-5 w-5" />
        </button>
    );
}
