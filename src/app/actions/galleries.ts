'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const gallerySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    profile_image_id: z.string().uuid().nullable(),
});

// Get all gallery collections (admin only)
export async function getGalleries() {
    return await db('gallery_collections')
        .leftJoin('images', 'gallery_collections.profile_image_id', 'images.id')
        .select('gallery_collections.*', 'images.data as profile_image')
        .orderBy('gallery_collections.name', 'asc');
}

// Get single gallery by ID with images
export async function getGalleryById(id: string) {
    const gallery = await db('gallery_collections')
        .leftJoin('images', 'gallery_collections.profile_image_id', 'images.id')
        .select('gallery_collections.*', 'images.data as profile_image')
        .where('gallery_collections.id', id)
        .first();

    if (!gallery) return null;

    // Get all images tagged with this gallery
    const images = await db('images')
        .join('gallery_images', 'images.id', 'gallery_images.image_id')
        .select('images.*')
        .where('gallery_images.gallery_id', id)
        .orderBy('gallery_images.created_at', 'desc');

    return {
        ...gallery,
        images,
    };
}

// Create gallery (admin only)
export async function createGallery(prevState: any, formData: FormData) {
    const validatedFields = gallerySchema.safeParse({
        name: formData.get('name'),
        profile_image_id: formData.get('profile_image_id') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const profileImageData = formData.get('profile_image') as string;
    let profileImageId = validatedFields.data.profile_image_id;

    try {
        if (profileImageData && profileImageData.startsWith('data:image')) {
            const [image] = await db('images').insert({ data: profileImageData }).returning('id');
            profileImageId = image.id;
        }

        const [gallery] = await db('gallery_collections')
            .insert({
                ...validatedFields.data,
                profile_image_id: profileImageId,
            })
            .returning('*');

        revalidatePath('/admin/galleries');
        redirect(`/admin/galleries/${gallery.id}/edit`);
    } catch (error) {
        return {
            message: 'Database Error: Failed to create gallery collection.',
        };
    }
}

// Update gallery (admin only)
export async function updateGallery(id: string, prevState: any, formData: FormData) {
    const validatedFields = gallerySchema.safeParse({
        name: formData.get('name'),
        profile_image_id: formData.get('profile_image_id') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await db('gallery_collections')
            .where('id', id)
            .update(validatedFields.data);

        revalidatePath('/admin/galleries');
        revalidatePath(`/admin/galleries/${id}/edit`);

        return { message: 'Gallery collection updated successfully' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to update gallery collection.',
        };
    }
}

// Delete gallery (admin only) - releases images from this tag
export async function deleteGallery(id: string) {
    try {
        // Delete will cascade to gallery_images junction table
        await db('gallery_collections').where('id', id).delete();

        revalidatePath('/admin/galleries');
    } catch (error) {
        return {
            message: 'Database Error: Failed to delete gallery collection.',
        };
    }

    redirect('/admin/galleries');
}

// Assign image to gallery (tag image)
export async function assignImageToGallery(galleryId: string, imageId: string) {
    try {
        // Check if already tagged
        const existing = await db('gallery_images')
            .where({ gallery_id: galleryId, image_id: imageId })
            .first();

        if (existing) {
            return { message: 'Image is already tagged with this gallery.' };
        }

        await db('gallery_images').insert({
            gallery_id: galleryId,
            image_id: imageId,
        });

        revalidatePath(`/admin/galleries/${galleryId}/edit`);
        revalidatePath('/admin/images');

        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to tag image with gallery.',
        };
    }
}

// Remove image from gallery (untag image)
export async function removeImageFromGallery(galleryId: string, imageId: string) {
    try {
        await db('gallery_images')
            .where({ gallery_id: galleryId, image_id: imageId })
            .delete();

        revalidatePath(`/admin/galleries/${galleryId}/edit`);
        revalidatePath('/admin/images');

        return { success: true };
    } catch (error) {
        return {
            message: 'Database Error: Failed to remove image from gallery.',
        };
    }
}
