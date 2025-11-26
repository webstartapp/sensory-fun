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

export const paymentGateway = {
    /**
     * Create a payment session and get redirect URL
     * In production, this would call the actual payment gateway API
     */
    createPaymentSession: async (
        amount: number,
        currency: string,
        bookingId: string,
        returnUrl: string
    ): Promise<PaymentSessionResult> => {
        console.log(`[MockGP] Creating payment session for ${amount} ${currency}, booking ${bookingId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In production, this would return the actual payment gateway URL
        // For now, we'll create a mock payment page URL
        const sessionId = `session_${Math.random().toString(36).substring(7)}`;
        const paymentUrl = `/payment?session=${sessionId}&booking=${bookingId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;

        return {
            success: true,
            sessionId,
            paymentUrl
        };
    },

    /**
     * Authorize a payment (hold funds)
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
