import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const image = await db('images').where({ id }).first();

        if (!image || !image.data) {
            return new NextResponse('Image not found', { status: 404 });
        }

        // Convert Base64 to Buffer
        const imageBuffer = Buffer.from(image.data, 'base64');

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg', // Assuming JPEG for now, could store mime type in DB
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
