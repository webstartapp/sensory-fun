'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const t = useTranslations('Navigation');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                            {t('login')}
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                        >
                            {t('register')}
                        </Link>
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
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
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
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
