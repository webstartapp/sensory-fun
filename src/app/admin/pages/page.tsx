import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';
import db from '@/lib/db';
import { Edit, Trash2 } from 'lucide-react';

export default async function AdminPagesPage() {
    const t = await getTranslations('Admin');
    const pages = await db('public_pages')
        .select('*')
        .orderBy('created_at', 'desc');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('pages.title')}
                </h1>
                <Link href="/admin/pages/new">
                    <Button>{t('pages.create')}</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('pages.pageTitle')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('bookings.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    /info/{page.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {page.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${page.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                        }`}>
                                        {page.is_published ? t('pages.isPublished') : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/pages/${page.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                        {t('Galleries.edit')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            Zatím nejsou vytvořeny žádné stránky
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
