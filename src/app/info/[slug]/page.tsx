import { notFound } from 'next/navigation';
import { getPublicPage } from '@/app/actions/pages';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

export default async function InfoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getPublicPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {page.title}
                    </h1>
                    <MarkdownRenderer content={page.content} />
                </article>
            </div>
        </div>
    );
}
