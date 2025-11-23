'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    name: string;
    defaultValue?: string | null;
    label?: string;
}

export default function ImageUpload({ name, defaultValue, label }: ImageUploadProps) {
    const t = useTranslations('Admin');
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label || t('imageUpload.label')}
            </label>

            <input
                type="hidden"
                name={name}
                value={preview || ''}
            />

            <div className="flex items-center justify-center w-full">
                {preview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-800">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label
                        htmlFor={`${name}-input`}
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 hover:bg-gray-100 dark:border-zinc-700 dark:hover:border-zinc-500"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">{t('imageUpload.clickToUpload')}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG, GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <input
                            id={`${name}-input`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>
                )}
            </div>
        </div>
    );
}
