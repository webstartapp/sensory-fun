import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const t = await getTranslations('Admin');

    if (!session || session.user.role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                {/* <SideNav /> - We will add this later */}
                <div className="p-4 bg-gray-100 h-full">
                    <h2 className="font-bold">Admin Dashboard</h2>
                    {/* Temporary Nav */}
                    <ul>
                        <li>{t('dashboard')}</li>
                    </ul>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
