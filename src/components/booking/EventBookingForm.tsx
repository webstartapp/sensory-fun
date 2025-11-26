'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { createEventBooking } from '@/app/actions/bookings';
import { useRouter, useSearchParams } from 'next/navigation';

import { Event } from '@/types/db';

export default function EventBookingForm({ event }: { event: Event }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const q = searchParams.get('quantity');
        if (q) {
            const parsed = parseInt(q);
            if (!isNaN(parsed) && parsed > 0) {
                setQuantity(parsed);
            }
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await createEventBooking(
                event.id,
                quantity,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                {
                    number: formData.cardNumber,
                    expiry: formData.expiry,
                    cvc: formData.cvc,
                    name: formData.name
                }
            );

            if (result.message && !result.bookingId) {
                setError(result.message);
                setLoading(false);
            } else {
                // Success - Redirect to success page or show message
                alert('Booking Successful! Check your email.');
                router.push('/events');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    const totalPrice = event.price * quantity;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Kontaktní údaje</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Počet osob</label>
                        <input
                            type="number"
                            min="1"
                            max="10" // TODO: Should ideally be limited by remaining capacity
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Jméno a Příjmení</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Telefon</label>
                        <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    <Button type="button" fullWidth onClick={() => setStep(2)}>
                        Pokračovat k platbě ({totalPrice} Kč)
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Platba kartou</h3>
                    <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-md mb-4">
                        <p className="font-medium">Cena k úhradě: {totalPrice} Kč</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Číslo karty (Test: 4242...)</label>
                        <input
                            required
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Platnost</label>
                            <input
                                required
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">CVC</label>
                            <input
                                required
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleChange}
                                placeholder="123"
                                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                            Zpět
                        </Button>
                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Zpracovává se...' : `Zaplatit ${totalPrice} Kč`}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
