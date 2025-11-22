import { useTranslations } from 'next-intl';

export default function AdminDashboardPage() {
    const t = useTranslations('Admin');
    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl">
                {t('dashboard')}
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Dashboard cards will go here */}
                <div className="p-4 bg-white shadow rounded-lg">
                    <h3 className="text-gray-500 text-sm">{t('totalBookings')}</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
            </div>
        </main>
    );
}
