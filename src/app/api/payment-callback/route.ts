import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentCallback } from '@/app/actions/payment';

/**
 * API route to handle payment callbacks from Global Payments HPP or mock payment page
 * This updates the booking status in the database based on payment result
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const result = await handlePaymentCallback(formData);

        return NextResponse.json(result);

    } catch (error) {
        console.error('[PaymentCallbackAPI] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
