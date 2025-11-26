'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createEventBookingAndInitiatePayment } from '@/app/actions/bookings';
import { Event } from '@/types/db';

interface EventBookingModalProps {
    event: Event;
    quantity: number;
    selectedDate: Date | null;
    onSuccess: () => void;
}

export default function EventBookingModal({ event, quantity, selectedDate, onSuccess }: EventBookingModalProps) {
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
                setError(result.message || 'Nepodařilo se vytvořit rezervaci');
                setLoading(false);
            } else {
                // Redirect to payment gateway
                window.location.href = result.paymentUrl;
            }
        } catch (err) {
            setError('Došlo k neočekávané chybě.');
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
                <h3 className="font-semibold text-lg mb-3">Souhrn rezervace</h3>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Akce:</span>
                    <span className="font-medium">{event.name}</span>
                </div>
                {selectedDate && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Datum:</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString('cs-CZ')}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Počet osob:</span>
                    <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <span>Celková cena:</span>
                    <span>{isFree ? 'Zdarma' : `${totalPrice} Kč`}</span>
                </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Kontaktní údaje</h3>

                <div>
                    <label className="block text-sm font-medium mb-1">Jméno a Příjmení *</label>
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
                    <label className="block text-sm font-medium mb-1">Email *</label>
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
                    <label className="block text-sm font-medium mb-1">Telefon *</label>
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
                {loading ? 'Zpracovává se...' : isFree ? 'Potvrdit rezervaci' : 'Pokračovat k platbě'}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {isFree
                    ? 'Potvrzením vytvoříte rezervaci.'
                    : 'Budete přesměrováni na platební bránu pro dokončení platby.'
                }
            </p>
        </form>
    );
}
