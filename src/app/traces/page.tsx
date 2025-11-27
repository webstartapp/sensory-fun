import { getTraces } from '@/app/actions/traces';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import TraceCard from '@/components/traces/TraceCard';

export default async function TracesPage() {
    const t = await getTranslations('Traces');
    const traces = await getTraces();

    return (
        <div className="min-h-screen py-24">
            <Container>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>

                {traces.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                        <p className="text-gray-500 dark:text-gray-400">{t('noTraces')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {traces.map((trace) => (
                            <TraceCard key={trace.id} trace={trace} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
