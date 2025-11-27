'use client';

import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';
import { formatImageSrc } from '@/lib/utils';

export default function GiftVoucherList({
    vouchers = [],
    title,
    subtitle
}: {
    vouchers: any[];
    title?: string;
    subtitle?: string;
}) {
    const t = useTranslations('Home.GiftVoucherList');
    const tRelated = useTranslations('RelatedContent');
    const displayTitle = title || t('title');
    const displaySubtitle = subtitle !== undefined ? subtitle : t('subtitle');

    if (vouchers.length === 0) {
        return (
            <section className="py-24 bg-gray-50 dark:bg-zinc-900">
                <Container>
                    <SectionHeading
                        title={displayTitle}
                        subtitle={displaySubtitle}
                        className="mb-12"
                    />
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-zinc-800 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                        <p>{tRelated('emptyVouchers')}</p>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-900">
            <Container>
                <SectionHeading
                    title={displayTitle}
                    subtitle={displaySubtitle}
                    align="center"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vouchers.map((voucher) => (
                        <Card key={voucher.id} className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                {voucher.image ? (
                                    <Image
                                        src={formatImageSrc(voucher.image) || ''}
                                        alt={voucher.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {voucher.name}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm line-clamp-2 grow">
                                    {voucher.description}
                                </p>

                                <div className="space-y-3 mt-auto">
                                    <Button
                                        href={`/vouchers/${voucher.id}`}
                                        variant="primary"
                                        fullWidth
                                    >
                                        {t('bookVoucher')}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
