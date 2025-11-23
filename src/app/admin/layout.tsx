import { auth } from '@/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { notFound } from 'next/navigation';
import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        notFound();
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50 dark:bg-zinc-950">
            <div className="w-full flex-none md:w-64">
                <AdminSidebar />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
        </div>
    );
}
