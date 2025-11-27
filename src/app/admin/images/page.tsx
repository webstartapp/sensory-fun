import { getAllImages } from '@/app/actions/images';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { Upload, Calendar, Ticket, Footprints, Library, Image as ImageIcon } from 'lucide-react';

export default async function ImagesPage() {
    const t = await getTranslations('Admin.Images');
    const images = await getAllImages();

    return (
        <Container className="py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t('subtitle')}
                    </p>
                </div>
                <Button href="/admin/images/upload" variant="primary">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('uploadImage')}
                </Button>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('noImages')}</p>
                    <Button href="/admin/images/upload" variant="primary" className="mt-4">
                        {t('uploadFirstImage')}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group"
                        >
                            <Image
                                src={formatImageSrc(image.data) || ''}
                                alt="Image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-opacity flex items-center justify-center">
                                <Button
                                    href={`/admin/images/${image.id}`}
                                    variant="secondary"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {t('viewDetails')}
                                </Button>
                            </div>

                            {/* Entity Assignment Icons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                {image.room_id && (
                                    <div className="bg-white/90 dark:bg-zinc-900/90 p-1.5 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400" title="Assigned to Room">
                                        <ImageIcon className="w-3 h-3" />
                                    </div>
                                )}
                                {image.event_id && (
                                    <div className="bg-white/90 dark:bg-zinc-900/90 p-1.5 rounded-full shadow-sm text-pink-600 dark:text-pink-400" title="Assigned to Event">
                                        <Calendar className="w-3 h-3" />
                                    </div>
                                )}
                                {image.voucher_id && (
                                    <div className="bg-white/90 dark:bg-zinc-900/90 p-1.5 rounded-full shadow-sm text-amber-600 dark:text-amber-400" title="Assigned to Voucher">
                                        <Ticket className="w-3 h-3" />
                                    </div>
                                )}
                                {image.trace_id && (
                                    <div className="bg-white/90 dark:bg-zinc-900/90 p-1.5 rounded-full shadow-sm text-emerald-600 dark:text-emerald-400" title="Assigned to Trace">
                                        <Footprints className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            {/* Gallery Tags */}
                            {image.galleries && image.galleries.length > 0 && (
                                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                                    {image.galleries.map((gallery: any) => (
                                        <div key={gallery.id} className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center truncate max-w-full">
                                            <Library className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{gallery.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}
