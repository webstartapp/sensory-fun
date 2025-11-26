'use server';

import db from '@/lib/db';
import { paymentGateway } from '@/lib/payment-gateway';
import { revalidatePath } from 'next/cache';

export async function handlePaymentCallback(formData: FormData) {
    try {
        const timestamp = formData.get('TIMESTAMP') as string;
        const merchantId = formData.get('MERCHANT_ID') as string;
        const orderId = formData.get('ORDER_ID') as string;
        const result = formData.get('RESULT') as string;
        const message = formData.get('MESSAGE') as string;
        const pasRef = formData.get('PASREF') as string || '';
        const authCode = formData.get('AUTHCODE') as string || '';
        const sha1hash = formData.get('SHA1HASH') as string;
        const amount = formData.get('AMOUNT') as string;

        const sharedSecret = process.env.GLOBAL_PAYMENTS_SHARED_SECRET;

        // Extract booking ID from order ID (format: booking_{id}_{timestamp})
        const bookingId = orderId.split('_')[1];

        // If no shared secret, we're in mock mode
        if (!sharedSecret) {
            console.log('[PaymentCallback] Mock mode - processing payment');

            // Check result code in mock mode too
            if (result === '00') {
                await db('bookings')
                    .where('id', bookingId)
                    .update({
                        status: 'confirmed',
                        payment_id: pasRef || orderId,
                        updated_at: new Date()
                    });

                revalidatePath('/admin/bookings');

                return {
                    success: true,
                    bookingId,
                    message: 'Payment successful'
                };
            } else {
                // Payment declined in mock mode
                await db('bookings')
                    .where('id', bookingId)
                    .update({
                        status: 'declined',
                        updated_at: new Date()
                    });

                revalidatePath('/admin/bookings');

                return {
                    success: false,
                    bookingId,
                    message: message || 'Payment declined'
                };
            }
        }

        // Verify signature
        const isValid = paymentGateway.verifyHPPResponse(
            timestamp,
            merchantId,
            orderId,
            result,
            message,
            pasRef,
            authCode,
            sha1hash,
            sharedSecret
        );

        if (!isValid) {
            console.error('[PaymentCallback] Invalid signature');
            return {
                success: false,
                message: 'Invalid payment signature'
            };
        }

        // Check result code (00 = success)
        if (result === '00') {
            // Payment successful - update booking
            await db('bookings')
                .where('id', bookingId)
                .update({
                    status: 'confirmed',
                    payment_id: pasRef,
                    updated_at: new Date()
                });

            console.log(`[PaymentCallback] Payment successful for booking ${bookingId}`);

            revalidatePath('/admin/bookings');

            return {
                success: true,
                bookingId,
                message: 'Payment successful'
            };
        } else {
            // Payment failed - update booking status
            await db('bookings')
                .where('id', bookingId)
                .update({
                    status: 'declined',
                    updated_at: new Date()
                });

            console.log(`[PaymentCallback] Payment failed for booking ${bookingId}: ${message}`);

            revalidatePath('/admin/bookings');

            return {
                success: false,
                bookingId,
                message: message || 'Payment failed'
            };
        }

    } catch (error) {
        console.error('[PaymentCallback] Error processing payment callback:', error);
        return {
            success: false,
            message: 'Error processing payment'
        };
    }
}

/**
 * Clean up abandoned bookings that have been in pending_payment status for too long
 * This should be run periodically (e.g., via cron job)
 */
export async function cleanupAbandonedBookings(minutesOld: number = 30) {
    try {
        const cutoffTime = new Date(Date.now() - minutesOld * 60 * 1000);

        const result = await db('bookings')
            .where('status', 'pending_payment')
            .where('created_at', '<', cutoffTime)
            .update({
                status: 'declined',
                updated_at: new Date()
            });

        console.log(`[CleanupJob] Cleaned up ${result} abandoned bookings older than ${minutesOld} minutes`);

        revalidatePath('/admin/bookings');

        return {
            success: true,
            cleanedCount: result
        };
    } catch (error) {
        console.error('[CleanupJob] Error cleaning up abandoned bookings:', error);
        return {
            success: false,
            cleanedCount: 0
        };
    }
}
