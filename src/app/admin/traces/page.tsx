import { getTraces } from '@/app/actions/traces';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { Plus, Sparkles } from 'lucide-react';

export default async function TracesPage() {
    const t = await getTranslations('Admin.Traces');
    const traces = await getTraces();

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
                <Button href="/admin/traces/create" variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('createTrace')}
                </Button>
            </div>

            {traces.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('noTraces')}</p>
                    <Button href="/admin/traces/create" variant="primary" className="mt-4">
                        {t('createFirstTrace')}
                    </Button>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('image')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('name')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('description')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('status')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {traces.map((trace) => (
                                <tr key={trace.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    <td className="px-6 py-4">
                                        {trace.image ? (
                                            <div className="relative w-12 h-12 rounded overflow-hidden">
                                                <Image
                                                    src={formatImageSrc(trace.image) || ''}
                                                    alt={trace.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {trace.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                            {trace.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${trace.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                            }`}>
                                            {trace.is_active ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            href={`/admin/traces/${trace.id}/edit`}
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
