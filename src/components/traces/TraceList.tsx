'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';
import { X } from 'lucide-react';

interface Trace {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

interface TraceListProps {
    traces: Trace[];
    traceImages?: Record<string, Array<{ id: string; data: string }>>;
}

export default function TraceList({ traces, traceImages = {} }: TraceListProps) {
    const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);

    if (traces.length === 0) return null;

    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Smyslové stopy
            </h2>

            <ul className="space-y-2">
                {traces.map((trace) => (
                    <li key={trace.id}>
                        <button
                            onMouseEnter={() => setSelectedTrace(trace)}
                            onMouseLeave={() => setSelectedTrace(null)}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                        >
                            • {trace.name}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Trace Detail Card (Popup on Hover) */}
            {selectedTrace && (
                <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
                    <div className="pointer-events-auto bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedTrace.name}
                                </h3>
                                <button
                                    onClick={() => setSelectedTrace(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {selectedTrace.image && (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={formatImageSrc(selectedTrace.image) || ''}
                                        alt={selectedTrace.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {selectedTrace.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {selectedTrace.description}
                                </p>
                            )}

                            {/* Trace Images Gallery */}
                            {traceImages[selectedTrace.id] && traceImages[selectedTrace.id].length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Galerie
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {traceImages[selectedTrace.id].map((img) => (
                                            <div key={img.id} className="relative aspect-square rounded overflow-hidden">
                                                <Image
                                                    src={formatImageSrc(img.data) || ''}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
