'use client';

import { useActionState, useState } from 'react';
import { createPage, updatePage } from '@/app/actions/pages';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface PageFormProps {
    page?: {
        id: string;
        slug: string;
        title: string;
        content: string;
        is_published: boolean;
    };
}

export default function PageForm({ page }: PageFormProps) {
    const t = useTranslations('Admin');
    const isEditing = !!page;
    const [content, setContent] = useState(page?.content || '');

    const action = isEditing ? updatePage.bind(null, page.id) : createPage;
    const [state, dispatch] = useActionState(action, undefined);

    return (
        <form action={dispatch} className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
                <div className="grid grid-cols-1 gap-6">
                    <Input
                        label={t('pages.slug')}
                        id="slug"
                        name="slug"
                        defaultValue={page?.slug}
                        required
                        error={state?.errors?.slug}
                        placeholder="contact"
                    />
                    <Input
                        label={t('pages.pageTitle')}
                        id="title"
                        name="title"
                        defaultValue={page?.title}
                        required
                        error={state?.errors?.title}
                    />
                    <div>
                        <RichTextEditor
                            label={t('pages.content')}
                            id="content-editor"
                            value={content}
                            onChange={setContent}
                            error={state?.errors?.content}
                            placeholder={t('pages.content')}
                            minHeight="300px"
                        />
                        {/* Hidden input to submit the content with the form */}
                        <input type="hidden" name="content" value={content} />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="is_published"
                            name="is_published"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                            defaultChecked={page?.is_published ?? false}
                        />
                        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900 dark:text-white">
                            {t('pages.isPublished')}
                        </label>
                    </div>
                </div>

                {state?.message && (
                    <p className="mt-4 text-sm text-red-500">{state.message}</p>
                )}

                <div className="mt-6 flex justify-end">
                    <Button type="submit">
                        {isEditing ? t('pages.update') : t('pages.create')}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
