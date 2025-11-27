import Image from 'next/image';
import Link from 'next/link';
import { formatImageSrc } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface TraceCardProps {
    trace: {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
    };
}

export default function TraceCard({ trace }: TraceCardProps) {
    return (
        <Link href={`/traces/${trace.id}`}>
            <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                {trace.image && (
                    <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src={formatImageSrc(trace.image) || ''}
                            alt={trace.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {trace.name}
                    </h3>
                    {trace.description && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                            {trace.description}
                        </p>
                    )}
                </div>
            </Card>
        </Link>
    );
}
