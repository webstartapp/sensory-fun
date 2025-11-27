'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Get all images (admin only)
export async function getAllImages() {
    const images = await db('images')
        .select('*')
        .orderBy('created_at', 'desc');

    // Fetch all gallery assignments
    const galleryAssignments = await db('gallery_images')
        .join('gallery_collections', 'gallery_images.gallery_id', 'gallery_collections.id')
        .select('gallery_images.image_id', 'gallery_collections.id', 'gallery_collections.name');

    // Map galleries to images
    return images.map(image => {
        const galleries = galleryAssignments
            .filter(ga => ga.image_id === image.id)
            .map(ga => ({ id: ga.id, name: ga.name }));
        return { ...image, galleries };
    }) as (typeof images[0] & { galleries: { id: string; name: string }[] })[];
}

// Get images by entity (room/event/trace/voucher)
export async function getImagesByEntity(entityType: 'room' | 'event' | 'trace' | 'voucher', entityId: string) {
    const column = `${entityType}_id`;
    return await db('images')
        .select('*')
        .where(column, entityId)
        .orderBy('created_at', 'desc');
}

// Get images in a gallery collection
export async function getImagesByGallery(galleryId: string) {
    return await db('images')
        .join('gallery_images', 'images.id', 'gallery_images.image_id')
        .select('images.*')
        .where('gallery_images.gallery_id', galleryId)
        .orderBy('gallery_images.created_at', 'desc');
}

// Upload image to system (admin only)
export async function uploadImage(formData: FormData) {
    const imageData = formData.get('data') as string;

    if (!imageData) {
        return {
            message: 'Image data is required.',
        };
    }

    try {
        const [image] = await db('images').insert({ data: imageData }).returning('*');
        revalidatePath('/admin/images');
        return { success: true, image };
    } catch (error) {
        return {
            message: 'Database Error: Failed to upload image.',
        };
    }
}

// Assign image to entity (room/event/trace/voucher)
export async function assignImageToEntity(
    imageId: string,
    entityType: 'room' | 'event' | 'trace' | 'voucher',
    entityId: string
) {
    const column = `${entityType}_id`;

    try {
        await db('images')
            .where('id', imageId)
            .update({ [column]: entityId });

        revalidatePath('/admin/images');
        revalidatePath(`/admin/${entityType}s/${entityId}/edit`);
        revalidatePath(`/${entityType}s/${entityId}`);

        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to assign image to entity.',
        };
    }
}

// Delete image (admin only) - check if used before deleting
export async function deleteImage(id: string) {
    try {
        // Check if image is used anywhere
        const image = await db('images').where('id', id).first();

        if (!image) {
            return { message: 'Image not found.' };
        }

        const isUsed = image.room_id || image.event_id || image.trace_id || image.voucher_id;

        if (isUsed) {
            return {
                message: 'Cannot delete image: It is currently assigned to an entity. Please unassign it first.',
            };
        }

        // Check if used as profile image in gallery collections
        const galleryUsingImage = await db('gallery_collections')
            .where('profile_image_id', id)
            .first();

        if (galleryUsingImage) {
            return {
                message: 'Cannot delete image: It is used as a profile image in a gallery collection.',
            };
        }

        // Check if used as profile image in traces
        const traceUsingImage = await db('traces')
            .where('image_id', id)
            .first();

        if (traceUsingImage) {
            return {
                message: 'Cannot delete image: It is used as a profile image in a trace.',
            };
        }

        await db('images').where('id', id).delete();
        revalidatePath('/admin/images');

        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to delete image.',
        };
    }
}

// Unassign image from entity
export async function unassignImageFromEntity(
    imageId: string,
    entityType: 'room' | 'event' | 'trace' | 'voucher'
) {
    const column = `${entityType}_id`;

    try {
        const image = await db('images').where('id', imageId).first();

        if (!image) {
            return { message: 'Image not found.' };
        }

        await db('images')
            .where('id', imageId)
            .update({ [column]: null });

        revalidatePath('/admin/images');

        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to unassign image.',
        };
    }
}
