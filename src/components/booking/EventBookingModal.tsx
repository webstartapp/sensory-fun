'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createEventBookingAndInitiatePayment } from '@/app/actions/bookings';
import { Event } from '@/types/db';
import { useTranslations } from 'next-intl';

interface EventBookingModalProps {
    event: Event;
    quantity: number;
    selectedDate: Date | null;
    onSuccess: () => void;
}

export default function EventBookingModal({ event, quantity, selectedDate, onSuccess }: EventBookingModalProps) {
    const t = useTranslations('Booking');
    const tEvent = useTranslations('EventDetails');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await createEventBookingAndInitiatePayment(
                event.id,
                quantity,
                selectedDate,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                }
            );

            if (!result.success || !result.paymentUrl) {
                setError(result.message || t('failedToCreateBooking'));
                setLoading(false);
            } else {
                // Redirect to payment gateway
                window.location.href = result.paymentUrl;
            }
        } catch (err) {
            setError(t('unexpectedError'));
            setLoading(false);
        }
    };

    const totalPrice = event.price * quantity;
    const isFree = event.price === 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Booking Summary */}
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg mb-3">{t('summary')}</h3>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('event')}:</span>
                    <span className="font-medium">{event.name}</span>
                </div>
                {selectedDate && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('date')}:</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString('cs-CZ')}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('peopleCount')}:</span>
                    <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <span>{t('totalPrice')}:</span>
                    <span>{isFree ? tEvent('free') : `${totalPrice} Kč`}</span>
                </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('contactDetails')}</h3>

                <div>
                    <label className="block text-sm font-medium mb-1">{t('fullName')} {t('requiredField')}</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        placeholder="Jan Novák"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">{t('email')} {t('requiredField')}</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        placeholder="jan.novak@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">{t('phone')} {t('requiredField')}</label>
                    <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        placeholder="+420 123 456 789"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading}>
                {loading ? t('processing') : isFree ? t('confirmBooking') : t('proceedToPayment')}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {isFree
                    ? t('confirmationNote')
                    : t('paymentRedirectNote')
                }
            </p>
        </form>
    );
}
