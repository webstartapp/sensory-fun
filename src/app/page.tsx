import Hero from '@/components/home/Hero';
import RoomList from '@/components/home/RoomList';
import GiftVoucherList from '@/components/home/GiftVoucherList';
import db from '@/lib/db';

export default async function Home() {
  let banners = [];
  let rooms = [];
  let vouchers = [];

  try {
    // Fetch Banners
    banners = await db('banners')
      .leftJoin('images', 'banners.image_id', 'images.id')
      .select('banners.*', 'images.data as image')
      .where('banners.is_active', true)
      .orderBy('banners.order', 'asc');

    // Fetch Rooms
    rooms = await db('rooms')
      .leftJoin('images', 'rooms.image_id', 'images.id')
      .select('rooms.*', 'images.data as image')
      .where('rooms.is_active', true)
      .andWhere('rooms.is_public', true)
      .orderBy('rooms.order', 'asc');

    // Fetch Vouchers
    vouchers = await db('vouchers')
      .leftJoin('images', 'vouchers.image_id', 'images.id')
      .select('vouchers.*', 'images.data as image')
      .where('vouchers.is_public', true)
      .orderBy('vouchers.order', 'asc');
  } catch (error) {
    console.error('Database connection failed during build:', error);
    // Return empty arrays if database is not available during build
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero banners={banners} />
      <RoomList rooms={rooms} />
      <GiftVoucherList vouchers={vouchers} />
    </div>
  );
}