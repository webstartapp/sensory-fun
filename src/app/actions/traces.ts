'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const traceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable(),
    image_id: z.string().uuid().nullable(),
    is_active: z.boolean().default(true),
});

// Get all active traces
export async function getTraces() {
    return await db('traces')
        .leftJoin('images', 'traces.image_id', 'images.id')
        .select('traces.*', 'images.data as image')
        .where('traces.is_active', true)
        .orderBy('traces.name', 'asc');
}

// Get single trace by ID with images and galleries
export async function getTraceById(id: string) {
    const trace = await db('traces')
        .leftJoin('images', 'traces.image_id', 'images.id')
        .select('traces.*', 'images.data as image')
        .where('traces.id', id)
        .first();

    if (!trace) return null;

    // Get all images directly assigned to this trace
    const traceImages = await db('images')
        .select('*')
        .where('trace_id', id);

    return {
        ...trace,
        traceImages,
    };
}

// Get traces by room ID
export async function getTracesByRoom(roomId: string) {
    return await db('traces')
        .join('rooms_traces', 'traces.id', 'rooms_traces.trace_id')
        .leftJoin('images', 'traces.image_id', 'images.id')
        .select('traces.*', 'images.data as image')
        .where('rooms_traces.room_id', roomId)
        .andWhere('traces.is_active', true)
        .orderBy('traces.name', 'asc');
}

// Get traces by event ID
export async function getTracesByEvent(eventId: string) {
    return await db('traces')
        .join('events_traces', 'traces.id', 'events_traces.trace_id')
        .leftJoin('images', 'traces.image_id', 'images.id')
        .select('traces.*', 'images.data as image')
        .where('events_traces.event_id', eventId)
        .andWhere('traces.is_active', true)
        .orderBy('traces.name', 'asc');
}

// Create trace (admin only)
export async function createTrace(prevState: any, formData: FormData) {
    const validatedFields = traceSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description') || null,
        image_id: formData.get('image_id') || null,
        is_active: formData.get('is_active') === 'true',
    });
    console.log(75, validatedFields);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const imageData = formData.get('image') as string;
    let imageId = validatedFields.data.image_id;

    try {
        if (imageData && imageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: imageData }).returning('id');
            imageId = image.id;
        }

        const [trace] = await db('traces').insert({
            ...validatedFields.data,
            image_id: imageId,
        }).returning('*');
        revalidatePath('/admin/traces');
        redirect(`/admin/traces/${trace.id}/edit`);
    } catch (error) {
        console.log('Create Trace Error:', error);
        return {
            message: error,
        };
    }
}

// Update trace (admin only)
export async function updateTrace(id: string, prevState: any, formData: FormData) {
    const validatedFields = traceSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description') || null,
        image_id: formData.get('image_id') || null,
        is_active: formData.get('is_active') === 'true',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await db('traces').where('id', id).update(validatedFields.data);
        revalidatePath('/admin/traces');
        revalidatePath(`/admin/traces/${id}/edit`);
        revalidatePath('/traces');
        revalidatePath(`/traces/${id}`);
        return { message: 'Trace updated successfully' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to update trace.',
        };
    }
}

// Delete trace (admin only)
export async function deleteTrace(id: string) {
    try {
        await db('traces').where('id', id).delete();
        revalidatePath('/admin/traces');
        revalidatePath('/traces');
    } catch (error) {
        return {
            message: 'Database Error: Failed to delete trace.',
        };
    }
    redirect('/admin/traces');
}

// Assign trace to room
export async function assignTraceToRoom(traceId: string, roomId: string) {
    try {
        await db('rooms_traces').insert({ trace_id: traceId, room_id: roomId });
        revalidatePath(`/admin/rooms/${roomId}/edit`);
        revalidatePath(`/admin/traces/${traceId}/edit`);
        revalidatePath(`/rooms/${roomId}`);
        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to assign trace to room.',
        };
    }
}

// Remove trace from room
export async function removeTraceFromRoom(traceId: string, roomId: string) {
    try {
        await db('rooms_traces')
            .where({ trace_id: traceId, room_id: roomId })
            .delete();
        revalidatePath(`/admin/rooms/${roomId}/edit`);
        revalidatePath(`/admin/traces/${traceId}/edit`);
        revalidatePath(`/rooms/${roomId}`);
        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to remove trace from room.',
        };
    }
}

// Assign trace to event
export async function assignTraceToEvent(traceId: string, eventId: string) {
    try {
        await db('events_traces').insert({ trace_id: traceId, event_id: eventId });
        revalidatePath(`/admin/events/${eventId}/edit`);
        revalidatePath(`/admin/traces/${traceId}/edit`);
        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to assign trace to event.',
        };
    }
}

// Remove trace from event
export async function removeTraceFromEvent(traceId: string, eventId: string) {
    try {
        await db('events_traces')
            .where({ trace_id: traceId, event_id: eventId })
            .delete();
        revalidatePath(`/admin/events/${eventId}/edit`);
        revalidatePath(`/admin/traces/${traceId}/edit`);
        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to remove trace from event.',
        };
    }
}

// Get rooms assigned to a trace
export async function getRoomsByTrace(traceId: string) {
    return await db('rooms')
        .join('rooms_traces', 'rooms.id', 'rooms_traces.room_id')
        .select('rooms.*')
        .where('rooms_traces.trace_id', traceId);
}

// Get events assigned to a trace
export async function getEventsByTrace(traceId: string) {
    try {
        return await db('events')
            .join('events_traces', 'events.id', 'events_traces.event_id')
            .select('events.*', 'events_traces.*')
            .where('events_traces.trace_id', traceId);
    } catch (error) {
        console.log(229, error, traceId);
        return [];
    }
}
