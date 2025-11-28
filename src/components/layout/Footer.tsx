'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Sparkles, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Sensory Fun
                            </span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('quickLinks')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/rooms" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('rooms')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('events')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('contact')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>Údolní 389/10<br />602 00 Brno-střed-Veveří</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>+420 774 908 782</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>sensory.fun.cz@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('followUs')}</h3>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/1HxWCowafC/" target="_blank" className="p-2 bg-white rounded-full shadow-sm hover:text-indigo-600 hover:shadow-md transition-all dark:bg-zinc-800 dark:text-gray-400 dark:hover:text-white">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/sensoryfuncz/#" target="_blank" className="p-2 bg-white rounded-full shadow-sm hover:text-pink-600 hover:shadow-md transition-all dark:bg-zinc-800 dark:text-gray-400 dark:hover:text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-500">
                        © {currentYear} Sensory Fun. {t('allRightsReserved')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
