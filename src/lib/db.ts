import knex from 'knex';
import config from '../../knexfile';
import { Event, Voucher, Booking, Room, Banner } from '@/types/db';

declare module 'knex' {
    interface Tables {
        events: Event;
        vouchers: Voucher;
        bookings: Booking;
        rooms: Room;
        banners: Banner;
    }
}

const db = knex({
    ...config.development,
    pool: {
        min: 1,
        max: 5,
        afterCreate: (conn: any, done: any) => {
            done(null, conn);
        }
    }
});

export default db;
