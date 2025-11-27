'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/app/actions/images';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploadForm() {
    const t = useTranslations('Admin.imageUpload');
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!preview) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('data', preview);

            const result = await uploadImage(formData);

            if (result.message) {
                setError(result.message);
            } else {
                // Success - redirect is handled in server action or we can reset
                // Since server action revalidates and we might want to upload more, 
                // typically we redirect. But if uploadImage doesn't redirect, we should.
                // Checking images.ts: it returns { success: true, image } or { message }.
                // It does NOT redirect. So we should redirect here.
                window.location.href = '/admin/images';
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-8 text-center">
                {preview ? (
                    <div className="relative inline-block">
                        <div className="relative w-64 h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer flex flex-col items-center justify-center space-y-4 py-8"
                    >
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full">
                            <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                {t('clickToUpload')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </div>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!preview || isUploading}
                    className="w-full sm:w-auto"
                >
                    {isUploading ? 'Uploading...' : t('label')}
                </Button>
                <Button href="/admin/images" variant="secondary" className="w-full sm:w-auto">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
