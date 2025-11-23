'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register, RegisterState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const initialState: RegisterState = {
    message: '',
    errors: {},
    success: false
};

export default function RegisterForm() {
    const [state, dispatch] = useActionState(register, initialState);
    const router = useRouter();
    const t = useTranslations('Auth');

    useEffect(() => {
        if (state?.success) {
            router.push('/login?registered=true');
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="space-y-3">
            <Card className="px-6 pb-4 pt-8 bg-gray-50 dark:bg-zinc-900 border-none shadow-none">
                <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {t('registerTitle')}
                </h1>
                <div className="w-full space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label={t('firstName')}
                                id="firstName"
                                type="text"
                                name="firstName"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                label={t('lastName')}
                                id="lastName"
                                type="text"
                                name="lastName"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Input
                            label={t('email')}
                            id="email"
                            type="email"
                            name="email"
                            required
                            error={state?.errors?.email && state.errors.email[0]}
                        />
                    </div>
                    <div>
                        <Input
                            label={t('password')}
                            id="password"
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            error={state?.errors?.password && state.errors.password[0]}
                        />
                    </div>
                </div>
                <RegisterButton />
                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                    {state?.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                </div>
            </Card>
        </form>
    );
}

function RegisterButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Auth');

    return (
        <Button
            type="submit"
            fullWidth
            className="mt-6 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            disabled={pending}
        >
            {t('registerButton')}
        </Button>
    );
}
