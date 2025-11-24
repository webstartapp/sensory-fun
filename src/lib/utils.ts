import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatImageSrc(image: string | null | undefined): string | null {
    if (!image) return null;
    if (image.startsWith('data:image') || image.startsWith('http')) {
        return image;
    }
    // Assume jpeg if no prefix, as per seeds
    return `data:image/jpeg;base64,${image}`;
}
