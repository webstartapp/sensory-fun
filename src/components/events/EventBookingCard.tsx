'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/db';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EventBookingModal from '@/components/booking/EventBookingModal';
import { Calendar, Clock, Users, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useTranslations } from 'next-intl';
import { getEventAvailability } from '@/app/actions/events';

export default function EventBookingCard({ event }: { event: Event }) {
    const t = useTranslations('EventDetails');
    const tBooking = useTranslations('Booking');
    const startDate = event.start_date ? new Date(event.start_date) : null;

    // Pre-select date for single events
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        event.type === 'single' && startDate ? startDate : undefined
    );
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);
    const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cast event to any to access capacity from join
    const totalCapacity = (event as any).capacity || 0;
    const isFree = event.price === 0;

    useEffect(() => {
        // Fetch availability for both repeating events and single events
        if (selectedDate) {
            setIsLoadingCapacity(true);
            getEventAvailability(event.id, selectedDate)
                .then(data => {
                    const available = Math.max(0, totalCapacity - data.bookedSeats);
                    setAvailableSeats(available);
                    // Reset quantity if it exceeds available
                    if (quantity > available) setQuantity(1);
                })
                .catch(err => {
                    console.error('Failed to fetch availability', err);
                    setAvailableSeats(null);
                })
                .finally(() => {
                    setIsLoadingCapacity(false);
                });
        } else {
            setAvailableSeats(null);
        }
    }, [selectedDate, event.id, totalCapacity, quantity]);

    const endDate = event.end_date ? new Date(event.end_date) : null;

    // Parse repeat_days
    let repeatDays: number[] = [];
    if (event.repeat_days) {
        if (Array.isArray(event.repeat_days)) {
            repeatDays = event.repeat_days;
        } else if (typeof event.repeat_days === 'string') {
            try {
                repeatDays = JSON.parse(event.repeat_days);
            } catch (e) {
                console.error('Failed to parse repeat_days', e);
                repeatDays = [];
            }
        }
    }

    // Calculate booking limit date (2 weeks from now or start date)
    const now = new Date();
    const baseDate = startDate && startDate > now ? startDate : now;
    const bookingLimitDate = new Date(baseDate);
    bookingLimitDate.setDate(bookingLimitDate.getDate() + 14);
    // Reset time part to end of day to allow booking on the 14th day
    bookingLimitDate.setHours(23, 59, 59, 999);

    const isDayDisabled = (date: Date) => {
        // 1. Past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;

        // 2. Before start date
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (date < start) return true;
        }

        // 3. After end date
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (date > end) return true;
        }

        // 4. After booking limit (2 weeks)
        if (date > bookingLimitDate) return true;

        // 5. Repeat days check
        if (event.type === 'repeating' && repeatDays.length > 0) {
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
            if (!repeatDays.includes(dayOfWeek)) return true;
        }

        return false;
    };

    const maxQuantity = availableSeats !== null ? availableSeats : totalCapacity;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('details')}
            </h3>

            <div className="space-y-4 mb-8">
                {event.type === 'single' && startDate && (
                    <>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-5 h-5" />
                                <span>{t('date')}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {format(startDate, 'd. M. yyyy')}
                            </span>
                        </div>

                        {endDate && (
                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Clock className="w-5 h-5" />
                                    <span>{t('time')}</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                                </span>
                            </div>
                        )}
                    </>
                )}

                {event.type === 'repeating' && (
                    <>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-5 h-5" />
                                <span>{t('validFrom')}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {startDate ? format(startDate, 'd. M. yyyy') : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Clock className="w-5 h-5" />
                                <span>{t('time')}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {event.repeat_time || '-'}
                            </span>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">{t('selectDate')}</h4>
                            <div className="bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg flex justify-center">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={cs}
                                    disabled={isDayDisabled}
                                    modifiers={{
                                        available: (date) => !isDayDisabled(date)
                                    }}
                                    modifiersClassNames={{
                                        available: 'font-bold text-gray-900 dark:text-white',
                                        selected: 'bg-indigo-600 !text-white hover:bg-indigo-500',
                                        today: 'text-indigo-600 font-bold',
                                        disabled: 'bg-gray-100 dark:bg-zinc-800/50 text-gray-300 dark:text-zinc-600 opacity-50 cursor-not-allowed font-normal'
                                    }}
                                    styles={{
                                        caption: { color: 'inherit' },
                                        head_cell: { color: 'inherit' },
                                        cell: { color: 'inherit' },
                                        day: { color: 'inherit' }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {event.type === 'campaign' && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-5 h-5" />
                            <span>{t('validity')}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {startDate ? format(startDate, 'd. M. yyyy') : ''}
                            {endDate ? ` - ${format(endDate, 'd. M. yyyy')}` : ''}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Users className="w-5 h-5" />
                        <span>{t('capacity')}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {isLoadingCapacity ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            availableSeats !== null ? (
                                <>
                                    <span className={availableSeats === 0 ? 'text-red-500' : 'text-green-600'}>
                                        {availableSeats}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-1">
                                        / {totalCapacity} {t('people')}
                                    </span>
                                </>
                            ) : (
                                <>{totalCapacity} {t('people')}</>
                            )
                        )}
                    </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <span className="font-medium">{t('people')}</span>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.min(availableSeats || 1, quantity + 1))}
                            disabled={!availableSeats || quantity >= availableSeats}
                            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <span className="font-medium">{t('price')}</span>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {event.price === 0 ? t('free') : `${event.price * quantity} Kč`}
                        </div>
                        {quantity > 1 && event.price > 0 && (
                            <div className="text-sm text-gray-500">
                                {quantity} × {event.price} Kč
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {event.type === 'repeating' && !selectedDate && (
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-md text-sm">
                    {t('selectDate')}
                </div>
            )}

            {availableSeats === 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm font-semibold">
                    {t('soldOut')}
                </div>
            )}

            <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                fullWidth
                size="lg"
                disabled={(event.type === 'repeating' && !selectedDate) || (availableSeats === 0)}
            >
                {availableSeats === 0 ? t('soldOut') : t('bookNow')}
            </Button>

            {/* Booking Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={tBooking('modalTitle')}
                showCancel={false}
            >
                <EventBookingModal
                    event={event}
                    quantity={quantity}
                    selectedDate={selectedDate || null}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        // Optionally refresh availability
                        if (selectedDate) {
                            getEventAvailability(event.id, selectedDate).then(data => {
                                const available = Math.max(0, totalCapacity - data.bookedSeats);
                                setAvailableSeats(available);
                            });
                        }
                    }}
                />
            </Modal>
        </div>
    );
}
