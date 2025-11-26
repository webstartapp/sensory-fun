'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createVoucherBooking } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';

import { Voucher } from '@/types/db';

export default function VoucherBookingForm({ voucher }: { voucher: Voucher }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        recipientName: '',
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
            const result = await createVoucherBooking(
                voucher.id,
                quantity,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                formData.recipientName,
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
                alert('Purchase Successful! Check your email.');
                router.push('/vouchers'); // Or home
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    const totalPrice = voucher.price * quantity;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Detaily objednávky</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Počet kusů</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Jméno obdarovaného (na poukaz)</label>
                        <input
                            required
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>

                    <h3 className="text-xl font-semibold pt-4">Kontaktní údaje (Kupující)</h3>
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
