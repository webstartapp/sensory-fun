
import { getAllImages } from '@/app/actions/images';
import { getGalleries } from '@/app/actions/galleries';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export default async function GalleryPage() {
    const t = await getTranslations('GalleryPage');

    // Fetch data
    const allImages = await getAllImages();
    const collections = await getGalleries();

    // Filter images that have at least one gallery assigned
    const galleryImages = allImages.filter(img => img.galleries && img.galleries.length > 0);

    return (
        <Container className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <GalleryGrid
                images={galleryImages}
                collections={collections}
            />
        </Container>
    );
}
