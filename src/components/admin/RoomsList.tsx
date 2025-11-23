'use client';

import { useState } from 'react';
import { reorderItems } from '@/app/actions/reorder';
import SortableList from './SortableList';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import DeleteRoomButton from './DeleteRoomButton';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Room {
    id: string;
    name: string;
    capacity: number | null;
    location: string | null;
    is_active: boolean;
    is_public: boolean;
    image_data?: string;
    order: number;
}

export default function RoomsList({ initialRooms }: { initialRooms: Room[] }) {
    const [rooms, setRooms] = useState(initialRooms);
    const t = useTranslations('Admin');

    const handleReorder = async (newRooms: Room[]) => {
        setRooms(newRooms);
        const orderUpdates = newRooms.map((room, index) => ({
            id: room.id,
            order: index,
        }));
        await reorderItems('rooms', orderUpdates);
    };

    const renderItem = (room: Room) => (
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    {room.image_data ? (
                        <Image
                            src={room.image_data}
                            alt={room.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {room.location && <span className="mr-2">{room.location}</span>}
                        {room.capacity && <span>{t('rooms.capacity')}: {room.capacity}</span>}
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {room.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                    <Link href={`/admin/rooms/${room.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Pencil className="h-5 w-5" />
                    </Link>
                    <DeleteRoomButton id={room.id} />
                </div>
            </div>
        </div>
    );

    return (
        <SortableList
            items={rooms}
            onReorder={handleReorder}
            renderItem={renderItem}
        />
    );
}
