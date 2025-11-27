'use client';

import { useFormState } from 'react-dom';
import { createGallery } from '@/app/actions/galleries';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function CreateGalleryPage() {
    const t = useTranslations('Admin.Galleries');
    const [state, formAction] = useFormState(createGallery, undefined);

    return (
        <Container className="py-8">
            <div className="mb-8">
                <Button href="/admin/galleries" variant="secondary" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zpět na seznam
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('createGallery')}
                </h1>

                {/* ... inside component ... */}

                <form action={formAction} className="space-y-6">
                    {/* Profile Image */}
                    <div>
                        <ImageUpload
                            name="profile_image"
                            label={t('imageUpload.label')}
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('name')} *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                        />
                        {state?.errors?.name && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
                        )}
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
                            Vytvořit galerii
                        </Button>
                        <Button href="/admin/galleries" variant="secondary">
                            Zrušit
                        </Button>
                    </div>
                </form>
            </div>
        </Container>
    );
}
