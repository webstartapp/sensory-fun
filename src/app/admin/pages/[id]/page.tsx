import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import PageForm from '@/components/admin/PageForm';

export default async function EditPagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const t = await getTranslations('Admin');
    const { id } = await params;

    const page = await db('public_pages').where({ id }).first();

    if (!page) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('pages.editTitle')}
            </h1>
            <PageForm page={page} />
        </div>
    );
}
