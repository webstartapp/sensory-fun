'use client';

import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function GiftVoucherList() {
    const t = useTranslations('Home.GiftVoucherList');

    // Dummy Data
    const vouchers = [
        {
            id: 1,
            name: "Základní Zážitek",
            description: "Vstup pro 1 osobu na 60 minut do libovolné místnosti.",
            image: "/image-gallery/3696f784-1d4c-46d6-8716-4c5f40204a73",
            roomId: null
        },
        {
            id: 2,
            name: "Rodinný Balíček",
            description: "Vstup pro celou rodinu (2+2) na 90 minut.",
            image: "/image-gallery/ade1654f-ca78-4370-90f3-f4691f51ce15",
            roomId: null
        },
        {
            id: 3,
            name: "Relaxace v Ocean Room",
            description: "Speciální balíček pro relaxaci v naší nejoblíbenější místnosti.",
            image: "/image-gallery/7e94e0bd-98ae-461b-ab40-8635f2c68ef7",
            roomId: 1
        }
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-900">
            <Container>
                <SectionHeading
                    title={t('title')}
                    subtitle={t('subtitle')}
                    align="center"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vouchers.map((voucher) => (
                        <Card key={voucher.id} className="group hover:shadow-xl transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${voucher.image})` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {voucher.name}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm line-clamp-2">
                                    {voucher.description}
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        href={`/vouchers/${voucher.id}`}
                                        variant="primary"
                                        fullWidth
                                    >
                                        {t('bookVoucher')}
                                    </Button>

                                    {voucher.roomId && (
                                        <Button
                                            href={`/rooms/${voucher.roomId}`}
                                            variant="ghost"
                                            fullWidth
                                            size="sm"
                                        >
                                            {t('viewRoom')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
