'use client';

import { useActionState } from 'react';
import { createVoucher, updateVoucher } from '@/app/actions/vouchers';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ImageUpload from './ImageUpload';
import { formatImageSrc } from '@/lib/utils';

interface VoucherFormProps {
    voucher?: {
        id: string;
        name: string;
        description: string | null;
        price: number;
        validity_days: number;
        capacity: number | null;
        order: number;
        is_active: boolean;
        is_public: boolean;
        is_featured: boolean;
        image_data?: string;
    };
}

export default function VoucherForm({ voucher }: VoucherFormProps) {
    const t = useTranslations('Admin');
    const isEditing = !!voucher;

    const action = isEditing ? updateVoucher.bind(null, voucher.id) : createVoucher;
    const [state, dispatch] = useActionState(action, undefined);

    return (
        <form action={dispatch} className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <ImageUpload
                            name="image"
                            defaultValue={formatImageSrc(voucher?.image_data)}
                            label={t('imageUpload.label')}
                        />
                    </div>
                    <Input
                        label={t('vouchers.name')}
                        id="name"
                        name="name"
                        defaultValue={voucher?.name}
                        required
                        error={state?.errors?.name}
                    />

                    <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('vouchers.description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                            defaultValue={voucher?.description || ''}
                        />
                    </div>

                    <Input
                        label={t('vouchers.price')}
                        id="price"
                        name="price"
                        type="number"
                        defaultValue={voucher?.price?.toString() || '0'}
                        error={state?.errors?.price}
                    />

                    <Input
                        label={t('vouchers.validityDays')}
                        id="validity_days"
                        name="validity_days"
                        type="number"
                        defaultValue={voucher?.validity_days?.toString() || '90'}
                        error={state?.errors?.validity_days}
                    />

                    <Input
                        label={t('vouchers.capacity')}
                        id="capacity"
                        name="capacity"
                        type="number"
                        defaultValue={voucher?.capacity?.toString()}
                        error={state?.errors?.capacity}
                    />

                    {/* Order is handled via Drag & Drop list */}
                    <input type="hidden" name="order" value={voucher?.order || 0} />

                    <div className="col-span-2 flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                id="is_active"
                                name="is_active"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                                defaultChecked={voucher?.is_active ?? false}
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
                                defaultChecked={voucher?.is_public ?? true}
                            />
                            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {t('vouchers.isPublic')}
                            </label>
                        </div>
                        {/* Removed is_featured as per user request */}
                    </div>
                </div>

                {state?.message && (
                    <p className="mt-4 text-sm text-red-500">{state.message}</p>
                )}

                <div className="mt-6 flex justify-end">
                    <Button type="submit">
                        {isEditing ? t('vouchers.update') : t('vouchers.create')}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
