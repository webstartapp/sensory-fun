'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useTranslations } from 'next-intl';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showCancel?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, showCancel = true }: ModalProps) {
    const t = useTranslations('Modal');

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Modal */}
            <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {showCancel && (
                    <div className="sticky bottom-0 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            fullWidth
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
