'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register, RegisterState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const initialState: RegisterState = {
    message: '',
    errors: {},
    success: false
};

import { useTranslations } from 'next-intl';

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
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl">
                    {t('registerTitle')}
                </h1>
                <div className="w-full">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="firstName">{t('firstName')}</label>
                            <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="firstName" type="text" name="firstName" required />
                        </div>
                        <div className="flex-1">
                            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="lastName">{t('lastName')}</label>
                            <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="lastName" type="text" name="lastName" required />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">{t('email')}</label>
                        <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="email" type="email" name="email" required />
                        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">{t('password')}</label>
                        <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="password" type="password" name="password" required minLength={6} />
                        {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
                    </div>
                </div>
                <RegisterButton />
                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                    {state?.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
}

function RegisterButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Auth');

    return (
        <button className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" aria-disabled={pending}>
            {t('registerButton')}
        </button>
    );
}
