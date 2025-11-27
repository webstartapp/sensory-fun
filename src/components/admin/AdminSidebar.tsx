'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Ticket, Settings, LogOut, Image as ImageIcon, Footprints, Library, Images } from 'lucide-react';
import { useTranslations } from 'next-intl';

const navigation = [
    { name: 'dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'rooms', href: '/admin/rooms', icon: ImageIcon },
    { name: 'events', href: '/admin/events', icon: Calendar },
    { name: 'bookings', href: '/admin/bookings', icon: Users },
    { name: 'vouchers', href: '/admin/vouchers', icon: Ticket },
    { name: 'traces', href: '/admin/traces', icon: Footprints },
    { name: 'galleries', href: '/admin/galleries', icon: Library },
    { name: 'images', href: '/admin/images', icon: Images },
    { name: 'banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const t = useTranslations('Admin');

    return (
        <div className="flex h-full w-64 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800">
            <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-zinc-800">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                                }`}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                                    }`}
                                aria-hidden="true"
                            />
                            {t(`nav.${item.name}`)}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-200 dark:border-zinc-800 p-4">
                <form action="/api/auth/signout" method="POST">
                    <button
                        type="submit"
                        className="group flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <LogOut
                            className="mr-3 h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300"
                            aria-hidden="true"
                        />
                        {t('nav.logout')}
                    </button>
                </form>
            </div>
        </div>
    );
}
