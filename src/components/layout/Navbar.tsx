'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Session } from 'next-auth';
import { logout } from '@/app/actions/auth';

export default function Navbar({ session }: { session: Session | null }) {
    const t = useTranslations('Navigation');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const user = session?.user;
    const isAdmin = user?.role === 'admin';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Sensory Fun
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                            {t('home')}
                        </Link>
                        <Link href="/rooms" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                            {t('rooms')}
                        </Link>
                        <Link href="/events" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                            {t('events')}
                        </Link>
                        <Link href="/gallery" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                            {t('gallery')}
                        </Link>
                    </div>

                    {/* Auth Buttons / Profile Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span>{user.name}</span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 dark:border-zinc-800">
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => logout()}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                                    {t('login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                    {t('register')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            href="/"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('home')}
                        </Link>
                        <Link
                            href="/rooms"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('rooms')}
                        </Link>
                        <Link
                            href="/events"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('events')}
                        </Link>
                        <Link
                            href="/gallery"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('gallery')}
                        </Link>

                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Signed in as {user.name}
                                    </div>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-900"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => logout()}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/10"
                                    >
                                        {t('logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 text-center text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-3 py-2 text-center text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

