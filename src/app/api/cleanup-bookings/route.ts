import { NextRequest, NextResponse } from 'next/server';
import { cleanupAbandonedBookings } from '@/app/actions/payment';

/**
 * API route to clean up abandoned bookings
 * Call this periodically via cron job or external scheduler
 * 
 * Example: GET /api/cleanup-bookings?minutes=30
 */
export async function GET(request: NextRequest) {
    try {
        // Optional: Add authentication/API key check here
        const apiKey = request.headers.get('x-api-key');
        if (process.env.CLEANUP_API_KEY && apiKey !== process.env.CLEANUP_API_KEY) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get minutes parameter from query string (default: 30)
        const searchParams = request.nextUrl.searchParams;
        const minutes = parseInt(searchParams.get('minutes') || '30');

        const result = await cleanupAbandonedBookings(minutes);

        return NextResponse.json({
            success: result.success,
            cleanedCount: result.cleanedCount,
            message: `Cleaned up ${result.cleanedCount} abandoned bookings older than ${minutes} minutes`
        });

    } catch (error) {
        console.error('[CleanupAPI] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
