import crypto from 'crypto';

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export interface PaymentSessionResult {
    success: boolean;
    sessionId?: string;
    paymentUrl?: string;
    error?: string;
}

export interface CardDetails {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
}

/**
 * Generate SHA1 hash for Global Payments signature
 */
function generateSHA1(data: string): string {
    return crypto.createHash('sha1').update(data).digest('hex');
}

/**
 * Generate Global Payments HPP signature
 * Format: timestamp.merchantId.orderId.amount.currency
 */
function generateHPPSignature(
    timestamp: string,
    merchantId: string,
    orderId: string,
    amount: string,
    currency: string,
    sharedSecret: string
): string {
    // First hash
    const toHash = `${timestamp}.${merchantId}.${orderId}.${amount}.${currency}`;
    const hash1 = generateSHA1(toHash);

    // Second hash with secret
    const hash2 = generateSHA1(`${hash1}.${sharedSecret}`);

    return hash2;
}

export const paymentGateway = {
    /**
     * Create a payment session and get redirect URL for Global Payments HPP
     */
    createPaymentSession: async (
        amount: number,
        currency: string,
        bookingId: string,
        returnUrl: string
    ): Promise<PaymentSessionResult> => {
        try {
            const merchantId = process.env.GLOBAL_PAYMENTS_MERCHANT_ID;
            const sharedSecret = process.env.GLOBAL_PAYMENTS_SHARED_SECRET;
            const hppUrl = process.env.GLOBAL_PAYMENTS_HPP_URL || 'https://pay.sandbox.realexpayments.com/pay';

            // If credentials not configured, use mock mode
            if (!merchantId || !sharedSecret) {
                console.warn('[PaymentGateway] Global Payments credentials not configured, using mock mode');
                const sessionId = `mock_session_${Math.random().toString(36).substring(7)}`;
                const paymentUrl = `/payment?session=${sessionId}&booking=${bookingId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;

                return {
                    success: true,
                    sessionId,
                    paymentUrl
                };
            }

            // Real Global Payments HPP integration
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const orderId = `booking_${bookingId}_${timestamp}`;
            const amountInCents = (amount * 100).toString(); // Convert to cents

            // Generate signature
            const signature = generateHPPSignature(
                timestamp,
                merchantId,
                orderId,
                amountInCents,
                currency,
                sharedSecret
            );

            // Build HPP URL with parameters
            const params = new URLSearchParams({
                TIMESTAMP: timestamp,
                MERCHANT_ID: merchantId,
                ORDER_ID: orderId,
                AMOUNT: amountInCents,
                CURRENCY: currency,
                SHA1HASH: signature,
                AUTO_SETTLE_FLAG: '0', // 0 = Auth only, 1 = Auth & Capture
                MERCHANT_RESPONSE_URL: returnUrl,
                HPP_VERSION: '2',
                // Optional: Add customer details
                // BILLING_CODE: bookingId,
                // COMMENT1: `Booking ${bookingId}`,
            });

            const paymentUrl = `${hppUrl}?${params.toString()}`;

            console.log(`[PaymentGateway] Created HPP session for booking ${bookingId}, amount ${amount} ${currency}`);

            return {
                success: true,
                sessionId: orderId,
                paymentUrl
            };

        } catch (error) {
            console.error('[PaymentGateway] Error creating payment session:', error);
            return {
                success: false,
                error: 'Failed to create payment session'
            };
        }
    },

    /**
     * Verify HPP response signature
     */
    verifyHPPResponse: (
        timestamp: string,
        merchantId: string,
        orderId: string,
        result: string,
        message: string,
        pasRef: string,
        authCode: string,
        receivedHash: string,
        sharedSecret: string
    ): boolean => {
        // Format: timestamp.merchantId.orderId.result.message.pasRef.authCode
        const toHash = `${timestamp}.${merchantId}.${orderId}.${result}.${message}.${pasRef}.${authCode}`;
        const hash1 = generateSHA1(toHash);
        const hash2 = generateSHA1(`${hash1}.${sharedSecret}`);

        return hash2 === receivedHash;
    },

    /**
     * Authorize a payment (hold funds) - Legacy method for direct API
     */
    authorize: async (amount: number, currency: string, card: CardDetails): Promise<PaymentResult> => {
        console.log(`[MockGP] Authorizing ${amount} ${currency} on card ending in ${card.number.slice(-4)}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock success for test cards
        if (card.number.startsWith('4')) {
            return {
                success: true,
                transactionId: `auth_${Math.random().toString(36).substring(7)}`
            };
        }

        return {
            success: false,
            error: 'Card declined'
        };
    },

    /**
     * Capture a previously authorized payment
     */
    capture: async (transactionId: string): Promise<PaymentResult> => {
        console.log(`[MockGP] Capturing transaction ${transactionId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            transactionId: `cap_${Math.random().toString(36).substring(7)}`
        };
    },

    /**
     * Void/Cancel a previously authorized payment
     */
    void: async (transactionId: string): Promise<PaymentResult> => {
        console.log(`[MockGP] Voiding transaction ${transactionId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            transactionId: `void_${Math.random().toString(36).substring(7)}`
        };
    }
};
