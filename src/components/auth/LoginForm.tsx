'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions/auth';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const t = useTranslations('Auth');

    return (
        <form action={dispatch} className="space-y-3">
            <Card className="px-6 pb-4 pt-8 bg-gray-50 dark:bg-zinc-900 border-none shadow-none">
                <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {t('loginTitle')}
                </h1>
                <div className="w-full space-y-4">
                    <Input
                        label={t('email')}
                        id="email"
                        type="email"
                        name="email"
                        placeholder={t('emailPlaceholder')}
                        required
                    />
                    <Input
                        label={t('password')}
                        id="password"
                        type="password"
                        name="password"
                        placeholder={t('passwordPlaceholder')}
                        required
                        minLength={6}
                    />
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
            </Card>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Auth');

    return (
        <Button
            type="submit"
            fullWidth
            className="mt-6"
            disabled={pending}
        >
            {t('loginButton')}
        </Button>
    );
}
