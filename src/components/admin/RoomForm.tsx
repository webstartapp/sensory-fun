'use client';

import { useActionState } from 'react';
import { createRoom, updateRoom } from '@/app/actions/rooms';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ImageUpload from './ImageUpload';
import { formatImageSrc } from '@/lib/utils';

interface RoomFormProps {
    room?: {
        id: string;
        name: string;
        description: string | null;
        location: string | null;
        capacity: number | null;
        is_active: boolean;
        is_public: boolean;
        order: number;
        image_data?: string;
    };
}

export default function RoomForm({ room }: RoomFormProps) {
    const t = useTranslations('Admin');
    const isEditing = !!room;

    const action = isEditing ? updateRoom.bind(null, room.id) : createRoom;
    const [state, dispatch] = useActionState(action, undefined);

    return (
        <form action={dispatch} className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <ImageUpload
                            name="image"
                            defaultValue={formatImageSrc(room?.image_data)}
                            label={t('imageUpload.label')}
                        />
                    </div>
                    <Input
                        label={t('rooms.name')}
                        id="name"
                        name="name"
                        defaultValue={room?.name}
                        required
                        error={state?.errors?.name}
                    />
                    <Input
                        label={t('rooms.location')}
                        id="location"
                        name="location"
                        defaultValue={room?.location || ''}
                        error={state?.errors?.location}
                    />
                    <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('rooms.description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                            defaultValue={room?.description || ''}
                        />
                    </div>
                    <Input
                        label={t('rooms.capacity')}
                        id="capacity"
                        name="capacity"
                        type="number"
                        defaultValue={room?.capacity?.toString()}
                        error={state?.errors?.capacity}
                    />
                    {/* Order is handled via Drag & Drop list */}
                    <input type="hidden" name="order" value={room?.order || 0} />

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                id="is_active"
                                name="is_active"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                defaultChecked={room?.is_active ?? true}
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {t('rooms.isActive')}
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="is_public"
                                name="is_public"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                defaultChecked={room?.is_public ?? true}
                            />
                            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {t('rooms.isPublic')}
                            </label>
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className="mt-4 text-sm text-red-500">{state.message}</p>
                )}

                <div className="mt-6 flex justify-end">
                    <Button type="submit">
                        {isEditing ? t('rooms.update') : t('rooms.create')}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
