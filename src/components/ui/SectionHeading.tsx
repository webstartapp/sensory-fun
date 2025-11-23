interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';
    className?: string;
}

export default function SectionHeading({
    title,
    subtitle,
    align = 'left',
    className = ''
}: SectionHeadingProps) {
    const alignStyles = align === 'center' ? 'text-center mx-auto' : 'text-left';

    return (
        <div className={`mb-12 ${alignStyles} ${className}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
