import Hero from '@/components/home/Hero';
import RoomList from '@/components/home/RoomList';
import GiftVoucherList from '@/components/home/GiftVoucherList';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <RoomList />
      <GiftVoucherList />
    </div>
  );
}