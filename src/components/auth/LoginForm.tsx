'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions/auth';

import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const t = useTranslations('Auth');

    return (
        <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl">
                    {t('loginTitle')}
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            {t('email')}
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder={t('emailPlaceholder')}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            {t('password')}
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder={t('passwordPlaceholder')}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <LoginButton />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Auth');

    return (
        <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" aria-disabled={pending}>
            {t('loginButton')}
        </button>
    );
}
