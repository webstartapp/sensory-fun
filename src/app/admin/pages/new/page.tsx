import { getTranslations } from 'next-intl/server';
import PageForm from '@/components/admin/PageForm';

export default async function NewPagePage() {
    const t = await getTranslations('Admin');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('pages.createTitle')}
            </h1>
            <PageForm />
        </div>
    );
}
