import Link from 'next/link';
import db from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import { Check, X } from 'lucide-react';
import BookingActions from '@/components/admin/BookingActions';

export default async function AdminBookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const t = await getTranslations('Admin');

    let query = db('bookings')
        .join('events', 'bookings.event_id', 'events.id')
        .select(
            'bookings.*',
            'events.name as event_name',
            'events.start_date as event_start_date'
        )
        .orderBy('bookings.created_at', 'desc');

    if (status) {
        query = query.where('bookings.status', status);
    }

    const bookings = await query;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('nav.bookings')}
                </h1>
                <div className="flex space-x-2">
                    <Link href="/admin/bookings" className={`px-3 py-1 rounded-md text-sm ${!status ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'}`}>
                        All
                    </Link>
                    <Link href="/admin/bookings?status=processing" className={`px-3 py-1 rounded-md text-sm ${status === 'processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'}`}>
                        Processing
                    </Link>
                    <Link href="/admin/bookings?status=accepted" className={`px-3 py-1 rounded-md text-sm ${status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'}`}>
                        Accepted
                    </Link>
                    <Link href="/admin/bookings?status=declined" className={`px-3 py-1 rounded-md text-sm ${status === 'declined' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'}`}>
                        Declined
                    </Link>
                </div>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    Event
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    Seats
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-950 dark:divide-zinc-800">
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{booking.event_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {booking.booking_time ? new Date(booking.booking_time).toLocaleString() : (booking.event_start_date ? new Date(booking.event_start_date).toLocaleString() : 'N/A')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {booking.seats}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {booking.total_price} CZK
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'accepted'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : booking.status === 'declined'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {booking.status === 'processing' && (
                                            <BookingActions id={booking.id} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
