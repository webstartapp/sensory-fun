'use client';

import { Check, X } from 'lucide-react';
import { approveBooking, declineBooking } from '@/app/actions/bookings';
import { useTransition } from 'react';

export default function BookingActions({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        if (confirm('Approve this booking?')) {
            startTransition(async () => {
                await approveBooking(id);
            });
        }
    };

    const handleDecline = () => {
        if (confirm('Decline this booking?')) {
            startTransition(async () => {
                await declineBooking(id);
            });
        }
    };

    return (
        <div className="flex justify-end space-x-2">
            <button
                onClick={handleApprove}
                disabled={isPending}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                title="Approve"
            >
                <Check className="h-5 w-5" />
            </button>
            <button
                onClick={handleDecline}
                disabled={isPending}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                title="Decline"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
