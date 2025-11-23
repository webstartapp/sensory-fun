'use client';

import { Trash2 } from 'lucide-react';
import { deleteRoom } from '@/app/actions/rooms';
import { useTransition } from 'react';

export default function DeleteRoomButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this room?')) {
            startTransition(async () => {
                await deleteRoom(id);
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
