import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import ImageUploadForm from '@/components/admin/ImageUploadForm';

export default function UploadImagePage() {
    const t = useTranslations('Admin.Images');

    return (
        <Container className="py-8">
            <div className="mb-8">
                <Button href="/admin/images" variant="secondary" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zpět na seznam
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('uploadImage')}
                </h1>

                <ImageUploadForm />
            </div>
        </Container>
    );
}
