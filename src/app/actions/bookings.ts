'use server';

import db from '@/lib/db';
import { paymentGateway, CardDetails } from '@/lib/payment-gateway';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

export type BookingState = {
    message?: string;
    errors?: {
        [key: string]: string[];
    };
    bookingId?: string;
};

function generateVoucherCode(): string {
    return randomBytes(4).toString('hex').toUpperCase();
}

export async function createEventBookingAndInitiatePayment(
    eventId: string,
    quantity: number,
    selectedDate: Date | null,
    customerDetails: { name: string; email: string; phone: string }
): Promise<{ success: boolean; paymentUrl?: string; message?: string }> {
    try {
        // 1. Validate Event
        const event = await db('events')
            .join('rooms', 'events.room_id', 'rooms.id')
            .select('events.*', 'rooms.capacity')
            .where('events.id', eventId)
            .first();

        if (!event) return { success: false, message: 'Event not found' };

        // 2. Check capacity
        const bookingDate = selectedDate || new Date(event.start_date);
        const startOfDay = new Date(bookingDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(bookingDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookingsCount = await db('bookings')
            .where('event_id', eventId)
            .whereBetween('booking_time', [startOfDay, endOfDay])
            .whereIn('status', ['authorized', 'confirmed', 'pending_payment'])
            .sum('seats as booked_seats')
            .first();

        const currentBookedSeats = Number(bookingsCount?.booked_seats || 0);

        if (event.capacity && (currentBookedSeats + quantity) > event.capacity) {
            return {
                success: false,
                message: `Not enough capacity. Available: ${Math.max(0, event.capacity - currentBookedSeats)}`
            };
        }

        const totalPrice = event.price * quantity;

        // 3. Create Booking with pending_payment status
        const [booking] = await db('bookings').insert({
            event_id: eventId,
            booking_type: 'event',
            booking_time: bookingDate,
            customer_name: customerDetails.name,
            customer_email: customerDetails.email,
            customer_phone: customerDetails.phone,
            status: 'pending_payment',
            total_price: totalPrice,
            seats: quantity
        }).returning('*');

        // 4. Create payment session
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking-confirmation`;
        const paymentSession = await paymentGateway.createPaymentSession(
            totalPrice,
            'CZK',
            booking.id,
            returnUrl
        );

        if (!paymentSession.success || !paymentSession.paymentUrl) {
            // Rollback booking
            await db('bookings').where('id', booking.id).del();
            return { success: false, message: 'Failed to create payment session' };
        }

        revalidatePath('/admin/bookings');
        return {
            success: true,
            paymentUrl: paymentSession.paymentUrl
        };

    } catch (error) {
        console.error('Create Event Booking Error:', error);
        return { success: false, message: 'Failed to create booking' };
    }
}

export async function createEventBooking(
    eventId: string,
    quantity: number,
    customerDetails: { name: string; email: string; phone: string },
    cardDetails: CardDetails
): Promise<BookingState> {
    try {
        // 1. Validate Event
        const event = await db('events').where('id', eventId).first();
        if (!event) return { message: 'Event not found' };

        // Check capacity
        const bookingsCount = await db('bookings')
            .where('event_id', eventId)
            .whereIn('status', ['authorized', 'confirmed', 'pending_payment'])
            .sum('seats as booked_seats')
            .first();

        const currentBookedSeats = Number(bookingsCount?.booked_seats || 0);
        const requestedSeats = quantity;

        if (event.capacity && (currentBookedSeats + requestedSeats) > event.capacity) {
            return { message: `Not enough capacity. Available: ${Math.max(0, event.capacity - currentBookedSeats)}` };
        }

        const totalPrice = event.price * quantity;

        // 2. Authorize Payment
        const paymentResult = await paymentGateway.authorize(totalPrice, 'CZK', cardDetails);
        if (!paymentResult.success) {
            return { message: `Payment failed: ${paymentResult.error}` };
        }

        // 3. Create Booking
        const [booking] = await db('bookings').insert({
            event_id: eventId,
            booking_type: 'event',
            customer_name: customerDetails.name,
            customer_email: customerDetails.email,
            customer_phone: customerDetails.phone,
            status: 'authorized',
            payment_id: paymentResult.transactionId,
            total_price: totalPrice,
            seats: quantity
        }).returning('id');

        revalidatePath('/admin/bookings');
        return { message: 'Booking successful! Waiting for confirmation.', bookingId: booking.id };

    } catch (error) {
        console.error('Create Event Booking Error:', error);
        return { message: 'Failed to create booking' };
    }
}

export async function createVoucherBooking(
    voucherId: string,
    quantity: number,
    customerDetails: { name: string; email: string; phone: string },
    recipientName: string,
    cardDetails: CardDetails
): Promise<BookingState> {
    try {
        // 1. Validate Voucher
        const voucher = await db('vouchers').where('id', voucherId).first();
        if (!voucher) return { message: 'Voucher not found' };

        const totalPrice = voucher.price * quantity;

        // 2. Authorize Payment
        const paymentResult = await paymentGateway.authorize(totalPrice, 'CZK', cardDetails);
        if (!paymentResult.success) {
            return { message: `Payment failed: ${paymentResult.error}` };
        }

        // 3. Create Booking
        const [booking] = await db('bookings').insert({
            voucher_id: voucherId,
            booking_type: 'voucher',
            quantity: quantity,
            customer_name: customerDetails.name, // Purchaser
            customer_email: customerDetails.email,
            customer_phone: customerDetails.phone,
            // We might want to store recipient name in a JSON column or separate table, 
            // but for now let's append it to name or use a note. 
            // Or better, since schema is fixed, let's assume customer_name is the purchaser 
            // and we'll add recipient logic later or just use customer_name for now.
            // Actually, let's just use customer_name as the contact person.
            status: 'authorized',
            payment_id: paymentResult.transactionId,
            total_price: totalPrice
        }).returning('id');

        revalidatePath('/admin/bookings');
        return { message: 'Voucher purchase successful! Waiting for confirmation.', bookingId: booking.id };

    } catch (error) {
        console.error('Create Voucher Booking Error:', error);
        return { message: 'Failed to create booking' };
    }
}

// Admin Actions

export async function adminApproveBooking(bookingId: string) {
    try {
        const booking = await db('bookings').where('id', bookingId).first();
        if (!booking) throw new Error('Booking not found');
        if (booking.status !== 'authorized') throw new Error('Booking is not in authorized state');
        if (!booking.payment_id) throw new Error('Payment ID missing');

        // Capture Payment
        const captureResult = await paymentGateway.capture(booking.payment_id);
        if (!captureResult.success) throw new Error('Payment capture failed');

        const updates: any = {
            status: 'confirmed'
        };

        // Generate Voucher Code if applicable
        if (booking.booking_type === 'voucher') {
            updates.voucher_code = generateVoucherCode();
        }

        await db('bookings').where('id', bookingId).update(updates);

        // TODO: Send Email (Mock)
        console.log(`[Email] Sending confirmation for booking ${bookingId}`);

        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error('Approve Booking Error:', error);
        return { success: false, error: 'Failed to approve booking' };
    }
}

export async function adminDeclineBooking(bookingId: string) {
    try {
        const booking = await db('bookings').where('id', bookingId).first();
        if (!booking) throw new Error('Booking not found');

        // Void Payment if authorized
        if (booking.status === 'authorized' && booking.payment_id) {
            await paymentGateway.void(booking.payment_id);
        }

        await db('bookings').where('id', bookingId).update({
            status: 'declined'
        });

        // TODO: Send Email (Mock)
        console.log(`[Email] Sending decline notification for booking ${bookingId}`);

        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error('Decline Booking Error:', error);
        return { success: false, error: 'Failed to decline booking' };
    }
}

export async function createManualBooking(
    type: 'event' | 'voucher',
    itemId: string, // eventId or voucherId
    customerDetails: { name: string; email: string; phone: string },
    quantity: number = 1
) {
    try {
        const updates: any = {
            booking_type: type,
            customer_name: customerDetails.name,
            customer_email: customerDetails.email,
            customer_phone: customerDetails.phone,
            status: 'confirmed', // Directly confirmed
            quantity: quantity,
            total_price: 0 // Admin created, maybe free or paid external
        };

        if (type === 'event') {
            updates.event_id = itemId;
            const event = await db('events').where('id', itemId).first();
            if (event) updates.total_price = event.price * quantity;
        } else {
            updates.voucher_id = itemId;
            updates.voucher_code = generateVoucherCode();
            const voucher = await db('vouchers').where('id', itemId).first();
            if (voucher) updates.total_price = voucher.price * quantity;
        }

        await db('bookings').insert(updates);
        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error('Manual Booking Error:', error);
        return { success: false, error: 'Failed to create manual booking' };
    }
}
