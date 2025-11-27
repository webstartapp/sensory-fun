import { getGalleries } from '@/app/actions/galleries';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { Plus, Image as ImageIcon } from 'lucide-react';

export default async function GalleriesPage() {
    const t = await getTranslations('Admin.Galleries');
    const galleries = await getGalleries();

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
                <Button href="/admin/galleries/create" variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('createGallery')}
                </Button>
            </div>

            {galleries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('noGalleries')}</p>
                    <Button href="/admin/galleries/create" variant="primary" className="mt-4">
                        {t('createFirstGallery')}
                    </Button>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('profileImage')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('name')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('imageCount')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {galleries.map((gallery) => (
                                <tr key={gallery.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    <td className="px-6 py-4">
                                        {gallery.profile_image ? (
                                            <div className="relative w-12 h-12 rounded overflow-hidden">
                                                <Image
                                                    src={formatImageSrc(gallery.profile_image) || ''}
                                                    alt={gallery.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {gallery.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {/* TODO: Add image count from join */}
                                            -
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            href={`/admin/galleries/${gallery.id}/edit`}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            {t('edit')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Container>
    );
}
