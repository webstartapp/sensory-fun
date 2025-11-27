'use client';

import { useFormState } from 'react-dom';
import { updateTrace, getTraceById, assignTraceToRoom, removeTraceFromRoom, assignTraceToEvent, removeTraceFromEvent, getRoomsByTrace, getEventsByTrace } from '@/app/actions/traces';
import { getRooms } from '@/app/actions/rooms';
import { getEvents } from '@/app/actions/events';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>
};

export default function EditTracePage() {

    const params = useParams();
    const id: string = params.id as string;
    const t = useTranslations('Admin.Traces');
    const [trace, setTrace] = useState<any>(null);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [assignedRooms, setAssignedRooms] = useState<string[]>([]);
    const [assignedEvents, setAssignedEvents] = useState<string[]>([]);

    const updateTraceWithId = updateTrace.bind(null, id);
    const [state, formAction] = useFormState(updateTraceWithId, initialState);

    useEffect(() => {
        Promise.all([
            getTraceById(id),
            getRooms(),
            getEvents(),
            getRoomsByTrace(id),
            getEventsByTrace(id)
        ]).then(([traceData, roomsData, eventsData, assignedRoomsData, assignedEventsData]) => {
            setTrace(traceData);
            setAllRooms(roomsData);
            setAllEvents(eventsData);
            setAssignedRooms(assignedRoomsData.map((r: any) => r.id));
            setAssignedEvents(assignedEventsData.map((e: any) => e.id));
        });
    }, [id]);

    const handleToggleRoom = async (roomId: string, isAssigned: boolean) => {
        if (isAssigned) {
            await removeTraceFromRoom(id, roomId);
            setAssignedRooms(prev => prev.filter(rId => rId !== roomId));
        } else {
            await assignTraceToRoom(id, roomId);
            setAssignedRooms(prev => [...prev, roomId]);
        }
    };

    const handleToggleEvent = async (eventId: string, isAssigned: boolean) => {
        if (isAssigned) {
            await removeTraceFromEvent(id, eventId);
            setAssignedEvents(prev => prev.filter(eId => eId !== eventId));
        } else {
            await assignTraceToEvent(id, eventId);
            setAssignedEvents(prev => [...prev, eventId]);
        }
    };

    if (!trace) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <Container className="py-8">
            <div className="mb-8">
                <Button href="/admin/traces" variant="secondary" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zpět na seznam
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Form */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 h-fit">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('edit')}
                    </h1>

                    <form action={formAction} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('name')} *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={trace.name}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('description')}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={trace.description || ''}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>

                        {/* Is Active */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                value="true"
                                defaultChecked={trace.is_active}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {t('active')}
                            </label>
                        </div>

                        {/* Error Message */}
                        {state?.message && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-600 dark:text-red-400 text-sm">{state.message}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button type="submit" variant="primary">
                                Uložit změny
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Assignments */}
                <div className="space-y-8">
                    {/* Rooms */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Přiřadit k místnostem
                        </h2>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {allRooms.map((room) => {
                                const isAssigned = assignedRooms.includes(room.id);
                                return (
                                    <div
                                        key={room.id}
                                        onClick={() => handleToggleRoom(room.id, isAssigned)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isAssigned
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white">{room.name}</span>
                                        {isAssigned && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Přiřadit k událostem
                        </h2>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {allEvents.map((event) => {
                                const isAssigned = assignedEvents.includes(event.id);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => handleToggleEvent(event.id, isAssigned)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isAssigned
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white">{event.name}</span>
                                        {isAssigned && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
