export interface Event {
    id: string;
    room_id: string;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number | null;
    order: number;
    image_id: string | null;
    is_public: boolean;
    is_featured: boolean;
    type: 'single' | 'repeating' | 'campaign';
    start_date: string | null;
    end_date: string | null;
    repeat_days: any | null;
    repeat_time: string | null;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}

export interface Voucher {
    id: string;
    status: 'active' | 'used' | 'expired';
    description: string | null;
    price: number;
    start_date: string;
    end_date: string | null;
    name: string;
    order: number;
    capacity: number | null;
    validity_days: number;
    image_id: string | null;
    created_at: Date;
    updated_at: Date;
    is_public: boolean;
    is_active: boolean;
}

export interface Booking {
    id: string;
    user_id: string | null;
    event_id: string | null;
    voucher_id: string | null;
    booking_type: 'event' | 'voucher';
    status: 'pending_payment' | 'authorized' | 'confirmed' | 'declined' | 'cancelled';
    seats: number;
    total_price: number;
    booking_time: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    created_at: Date;
    updated_at: Date;
    quantity: number;
    voucher_code: string | null;
    payment_id: string | null;
}

export interface Room {
    id: string;
    name: string;
    location: string | null;
    description: string | null;
    capacity: number | null;
    order: number;
    image_id: string | null;
    is_active: boolean;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    button_text: string;
    image_id: string | null;
    type: 'room' | 'event' | 'voucher' | 'link';
    link: string | null;
    room_id: string | null;
    event_id: string | null;
    voucher_id: string | null;
    order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
