import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function BookingConfirmationPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const t = await getTranslations('PaymentConfirmation');
    const params = await searchParams;
    const result = params.RESULT as string;
    const orderId = params.ORDER_ID as string;
    const message = params.MESSAGE as string;

    // Extract booking ID from order ID (format: booking_{id}_{timestamp})
    const bookingId = orderId ? orderId.split('_')[1] : undefined;

    // Check if payment was successful (00 = success in Global Payments)
    const success = result === '00';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
                {success ? (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('success.title')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('success.message')}
                            </p>
                        </div>
                        {bookingId && (
                            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('success.bookingNumber')}
                                </p>
                                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                                    {bookingId}
                                </p>
                            </div>
                        )}
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('success.emailSent')}
                            </p>
                            <Link href="/events">
                                <Button fullWidth>
                                    {t('success.backToEvents')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <XCircle className="w-20 h-20 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('failure.title')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {message || t('failure.message')}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('failure.retryMessage')}
                            </p>
                            <div className="flex gap-3">
                                <Link href="/events" className="flex-1">
                                    <Button variant="outline" fullWidth>
                                        {t('failure.backToEvents')}
                                    </Button>
                                </Link>
                                <Link href="/info/contact" className="flex-1">
                                    <Button fullWidth>
                                        {t('failure.contact')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
