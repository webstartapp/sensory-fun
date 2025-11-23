'use client';

import { useState } from 'react';
import { reorderItems } from '@/app/actions/reorder';
import SortableList from './SortableList';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import DeleteEventButton from './DeleteEventButton';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Event {
    id: string;
    name: string;
    type: string;
    price: number;
    room_name?: string;
    image_data?: string;
    order: number;
}

export default function EventsList({ initialEvents }: { initialEvents: Event[] }) {
    const [events, setEvents] = useState(initialEvents);
    const t = useTranslations('Admin');

    const handleReorder = async (newEvents: Event[]) => {
        setEvents(newEvents);
        const orderUpdates = newEvents.map((event, index) => ({
            id: event.id,
            order: index,
        }));
        await reorderItems('events', orderUpdates);
    };

    const renderItem = (event: Event) => (
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    {event.image_data ? (
                        <Image
                            src={event.image_data}
                            alt={event.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.room_name && <span className="mr-2">{event.room_name}</span>}
                        <span>{event.type}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.price} CZK
                </span>
                <div className="flex space-x-2">
                    <Link href={`/admin/events/${event.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Pencil className="h-5 w-5" />
                    </Link>
                    <DeleteEventButton id={event.id} />
                </div>
            </div>
        </div>
    );

    return (
        <SortableList
            items={events}
            onReorder={handleReorder}
            renderItem={renderItem}
        />
    );
}
