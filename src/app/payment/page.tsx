'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CreditCard } from 'lucide-react';

export default function MockPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const session = searchParams.get('session');
    const bookingId = searchParams.get('booking');
    const amount = searchParams.get('amount');
    const returnUrl = searchParams.get('return');

    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock success response
        const orderId = `booking_${bookingId}_${Math.floor(Date.now() / 1000)}`;
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params = new URLSearchParams({
            RESULT: '00', // 00 = success
            MESSAGE: 'Payment successful',
            ORDER_ID: orderId,
            PASREF: `mock_${Math.random().toString(36).substring(7)}`,
            AUTHCODE: `mock_auth_${Math.random().toString(36).substring(7)}`,
            TIMESTAMP: timestamp,
            MERCHANT_ID: 'mock_merchant',
            SHA1HASH: 'mock_hash'
        });

        // Call payment callback to update booking status
        try {
            const formData = new FormData();
            formData.append('TIMESTAMP', timestamp);
            formData.append('MERCHANT_ID', 'mock_merchant');
            formData.append('ORDER_ID', orderId);
            formData.append('RESULT', '00');
            formData.append('MESSAGE', 'Payment successful');
            formData.append('PASREF', params.get('PASREF') || '');
            formData.append('AUTHCODE', params.get('AUTHCODE') || '');
            formData.append('SHA1HASH', 'mock_hash');
            formData.append('AMOUNT', amount || '0');

            await fetch('/api/payment-callback', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Payment callback error:', error);
        }

        // Redirect to return URL with payment result
        window.location.href = `${returnUrl}?${params.toString()}`;
    };

    const handleDecline = async () => {
        setLoading(true);

        const orderId = `booking_${bookingId}_${Math.floor(Date.now() / 1000)}`;
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params = new URLSearchParams({
            RESULT: '101', // 101 = declined
            MESSAGE: 'Card declined',
            ORDER_ID: orderId,
            TIMESTAMP: timestamp,
            MERCHANT_ID: 'mock_merchant',
            SHA1HASH: 'mock_hash'
        });

        // Call payment callback to update booking status
        try {
            const formData = new FormData();
            formData.append('TIMESTAMP', timestamp);
            formData.append('MERCHANT_ID', 'mock_merchant');
            formData.append('ORDER_ID', orderId);
            formData.append('RESULT', '101');
            formData.append('MESSAGE', 'Card declined');
            formData.append('PASREF', '');
            formData.append('AUTHCODE', '');
            formData.append('SHA1HASH', 'mock_hash');
            formData.append('AMOUNT', amount || '0');

            await fetch('/api/payment-callback', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Payment callback error:', error);
        }

        window.location.href = `${returnUrl}?${params.toString()}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Mock Payment Gateway
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        This is a test payment page
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                        <span className="font-mono font-semibold">{bookingId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                        <span className="font-bold text-lg">{amount} Kč</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <input
                            required
                            type="text"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            className="w-full p-3 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry</label>
                            <input
                                required
                                type="text"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                placeholder="MM/YY"
                                className="w-full p-3 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">CVC</label>
                            <input
                                required
                                type="text"
                                value={cardData.cvc}
                                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                                placeholder="123"
                                className="w-full p-3 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                        <input
                            required
                            type="text"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full p-3 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Processing...' : `Pay ${amount} Kč`}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={handleDecline}
                            disabled={loading}
                        >
                            Simulate Decline
                        </Button>
                    </div>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                        🔒 This is a mock payment page for testing purposes only
                    </p>
                </form>
            </div>
        </div>
    );
}
