'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { createBanner, updateBanner } from '@/app/actions/banners';
import Button from '@/components/ui/Button';
import ImageUpload from './ImageUpload';
import { useTranslations } from 'next-intl';

interface BannerFormProps {
    banner?: {
        id: string;
        title: string;
        subtitle: string;
        button_text: string;
        type: 'room' | 'event' | 'voucher' | 'link';
        link?: string | null;
        room_id?: string | null;
        event_id?: string | null;
        voucher_id?: string | null;
        image_data?: string;
        is_active: boolean;
    };
    rooms: { id: string; name: string }[];
    events: { id: string; name: string }[];
    vouchers: { id: string; name: string }[];
}

export default function BannerForm({ banner, rooms, events, vouchers }: BannerFormProps) {
    const t = useTranslations('Admin.banners');
    const [state, formAction] = useFormState(banner ? updateBanner.bind(null, banner.id) : createBanner, null);
    const [type, setType] = useState(banner?.type || 'room');

    return (
        <form action={formAction} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
            {state?.message && (
                <div className={`p-4 rounded-md ${state.message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('image')}
                    </label>
                    <ImageUpload name="image" defaultValue={banner?.image_data} />
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('title')}
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={banner?.title}
                        required
                        maxLength={50}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                    />
                    {state?.errors?.title && <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>}
                </div>

                {/* Subtitle */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('subtitle')}
                    </label>
                    <input
                        type="text"
                        name="subtitle"
                        id="subtitle"
                        defaultValue={banner?.subtitle}
                        required
                        maxLength={100}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                    />
                    {state?.errors?.subtitle && <p className="mt-1 text-sm text-red-600">{state.errors.subtitle}</p>}
                </div>

                {/* Button Text */}
                <div>
                    <label htmlFor="button_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('buttonText')}
                    </label>
                    <input
                        type="text"
                        name="button_text"
                        id="button_text"
                        defaultValue={banner?.button_text}
                        required
                        maxLength={20}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                    />
                    {state?.errors?.button_text && <p className="mt-1 text-sm text-red-600">{state.errors.button_text}</p>}
                </div>

                {/* Type Selection */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('type')}
                    </label>
                    <select
                        name="type"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                    >
                        <option value="room">{t('types.room')}</option>
                        <option value="event">{t('types.event')}</option>
                        <option value="voucher">{t('types.voucher')}</option>
                        <option value="link">{t('types.link')}</option>
                    </select>
                </div>

                {/* Conditional Fields */}
                {type === 'room' && (
                    <div>
                        <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('selectRoom')}
                        </label>
                        <select
                            name="room_id"
                            id="room_id"
                            defaultValue={banner?.room_id || ''}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                        >
                            <option value="">{t('selectRoomPlaceholder')}</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {type === 'event' && (
                    <div>
                        <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('selectEvent')}
                        </label>
                        <select
                            name="event_id"
                            id="event_id"
                            defaultValue={banner?.event_id || ''}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                        >
                            <option value="">{t('selectEventPlaceholder')}</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {type === 'voucher' && (
                    <div>
                        <label htmlFor="voucher_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('selectVoucher')}
                        </label>
                        <select
                            name="voucher_id"
                            id="voucher_id"
                            defaultValue={banner?.voucher_id || ''}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                        >
                            <option value="">{t('selectVoucherPlaceholder')}</option>
                            {vouchers.map(voucher => (
                                <option key={voucher.id} value={voucher.id}>{voucher.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {type === 'link' && (
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('linkUrl')}
                        </label>
                        <input
                            type="text"
                            name="link"
                            id="link"
                            defaultValue={banner?.link || ''}
                            required
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm p-2 border"
                        />
                    </div>
                )}

                {/* Is Active */}
                <div className="flex items-center">
                    <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        defaultChecked={banner?.is_active ?? true}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        {t('isActive')}
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="submit" variant="primary">
                    {banner ? t('update') : t('create')}
                </Button>
            </div>
        </form>
    );
}
