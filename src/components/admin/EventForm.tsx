'use client';

import { useActionState, useState } from 'react';
import { createEvent, updateEvent } from '@/app/actions/events';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ImageUpload from './ImageUpload';

interface Room {
    id: string;
    name: string;
}

interface EventFormProps {
    event?: {
        id: string;
        room_id: string;
        name: string;
        description: string | null;
        price: number;
        duration_minutes: number | null;
        order: number;
        is_public: boolean;
        is_featured: boolean;
        type: "single" | "repeating" | "campaign";
        start_date: Date | null;
        end_date: Date | null;
        repeat_days: any; // JSON or array
        repeat_time: string | null;
        image_data?: string;
    };
    rooms: Room[];
}

export default function EventForm({ event, rooms }: EventFormProps) {
    const t = useTranslations('Admin');
    const isEditing = !!event;

    const action = isEditing ? updateEvent.bind(null, event.id) : createEvent;
    const [state, dispatch] = useActionState(action, undefined);

    const [type, setType] = useState(event?.type || 'single');

    // Parse repeat_days if it's a string (JSON)
    let initialRepeatDays: number[] = [];
    if (event?.repeat_days) {
        if (Array.isArray(event.repeat_days)) {
            initialRepeatDays = event.repeat_days;
        } else if (typeof event.repeat_days === 'string') {
            try {
                initialRepeatDays = JSON.parse(event.repeat_days);
            } catch (e) {
                initialRepeatDays = [];
            }
        }
    }

    return (
        <form action={dispatch} className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <ImageUpload
                            name="image"
                            defaultValue={event?.image_data}
                            label={t('imageUpload.label')}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('events.room')}
                        </label>
                        <select
                            id="room_id"
                            name="room_id"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                            defaultValue={event?.room_id}
                            required
                        >
                            <option value="">{t('events.selectRoom')}</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                        {state?.errors?.room_id && <p className="text-sm text-red-500 mt-1">{state.errors.room_id}</p>}
                    </div>

                    <Input
                        label={t('events.name')}
                        id="name"
                        name="name"
                        defaultValue={event?.name}
                        required
                        error={state?.errors?.name}
                    />

                    <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('events.description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                            defaultValue={event?.description || ''}
                        />
                    </div>

                    <Input
                        label={t('events.price')}
                        id="price"
                        name="price"
                        type="number"
                        defaultValue={event?.price?.toString() || '0'}
                        error={state?.errors?.price}
                    />

                    <Input
                        label={t('events.duration')}
                        id="duration_minutes"
                        name="duration_minutes"
                        type="number"
                        defaultValue={event?.duration_minutes?.toString()}
                        error={state?.errors?.duration_minutes}
                    />

                    <div className="col-span-2 md:col-span-1">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('events.type')}
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            required
                        >
                            <option value="single">{t('events.types.single')}</option>
                            <option value="repeating">{t('events.types.repeating')}</option>
                            <option value="campaign">{t('events.types.campaign')}</option>
                        </select>
                    </div>

                    {/* Order is handled via Drag & Drop list */}
                    <input type="hidden" name="order" value={event?.order || 0} />

                    {/* Type specific fields */}
                    {type === 'single' && (
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('events.startDate')}
                            </label>
                            <input
                                type="datetime-local"
                                id="start_date"
                                name="start_date"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                                defaultValue={event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : ''}
                            />
                        </div>
                    )}

                    {type === 'repeating' && (
                        <div className="col-span-2 space-y-4 border-t pt-4 border-gray-200 dark:border-zinc-800">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('events.repeatingSettings')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('events.repeatDays')}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                            <label key={day} className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="repeat_days"
                                                    value={index}
                                                    defaultChecked={initialRepeatDays.includes(index)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="repeat_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('events.repeatTime')}
                                    </label>
                                    <input
                                        type="time"
                                        id="repeat_time"
                                        name="repeat_time"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                                        defaultValue={event?.repeat_time || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {type === 'campaign' && (
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('events.startDate')}
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start_date"
                                    name="start_date"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                                    defaultValue={event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : ''}
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('events.endDate')}
                                </label>
                                <input
                                    type="datetime-local"
                                    id="end_date"
                                    name="end_date"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                                    defaultValue={event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : ''}
                                />
                            </div>
                        </div>
                    )}

                    <div className="col-span-2 flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                id="is_public"
                                name="is_public"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                defaultChecked={event?.is_public ?? true}
                            />
                            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {t('events.isPublic')}
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="is_featured"
                                name="is_featured"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                defaultChecked={event?.is_featured ?? false}
                            />
                            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {t('events.isFeatured')}
                            </label>
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className="mt-4 text-sm text-red-500">{state.message}</p>
                )}

                <div className="mt-6 flex justify-end">
                    <Button type="submit">
                        {isEditing ? t('events.update') : t('events.create')}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
