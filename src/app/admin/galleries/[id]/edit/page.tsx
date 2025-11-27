'use client';

import { useFormState } from 'react-dom';
import { updateGallery, getGalleryById, assignImageToGallery, removeImageFromGallery } from '@/app/actions/galleries';
import { getAllImages } from '@/app/actions/images';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { useParams } from 'next/navigation';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>
};

export default function EditGalleryPage() {
    const params = useParams();
    const id: string = params.id as string;
    const t = useTranslations('Admin.Galleries');
    const [gallery, setGallery] = useState<any>(null);
    const [allImages, setAllImages] = useState<any[]>([]);

    const updateGalleryWithId = updateGallery.bind(null, id);
    const [state, formAction] = useFormState(updateGalleryWithId, initialState);

    useEffect(() => {
        Promise.all([
            getGalleryById(id),
            getAllImages()
        ]).then(([galleryData, imagesData]) => {
            setGallery(galleryData);
            setAllImages(imagesData);
        });
    }, [id]);

    const handleToggleImage = async (imageId: string, isAssigned: boolean) => {
        if (isAssigned) {
            await removeImageFromGallery(id, imageId);
            setGallery((prev: any) => ({
                ...prev,
                images: prev.images.filter((img: any) => img.id !== imageId)
            }));
        } else {
            await assignImageToGallery(id, imageId);
            // Find image in allImages to add to gallery.images
            const imageToAdd = allImages.find(img => img.id === imageId);
            if (imageToAdd) {
                setGallery((prev: any) => ({
                    ...prev,
                    images: [...prev.images, imageToAdd]
                }));
            }
        }
    };

    if (!gallery) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <Container className="py-8">
            <div className="mb-8">
                <Button href="/admin/galleries" variant="secondary" size="sm">
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
                        <input type="hidden" name="id" value={gallery.id} />

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('name')} *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={gallery.name}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                            />
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

                {/* Image Selection */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Vybrat obrázky
                    </h2>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-1">
                        {allImages.map((image) => {
                            const isAssigned = gallery.images?.some((img: any) => img.id === image.id);
                            return (
                                <div
                                    key={image.id}
                                    onClick={() => handleToggleImage(image.id, isAssigned)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isAssigned
                                        ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-zinc-900'
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-700'
                                        }`}
                                >
                                    <Image
                                        src={formatImageSrc(image.data) || ''}
                                        alt="Gallery image"
                                        fill
                                        className={`object-cover ${isAssigned ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                    />
                                    {isAssigned && (
                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
}
