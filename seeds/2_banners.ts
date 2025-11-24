import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("banners").del();

    // Get all image IDs
    const images = await knex("images").select("id");
    const imageIds = images.map(img => img.id);

    if (imageIds.length === 0) {
        console.warn("No images found in DB. Skipping banner seeding.");
        return;
    }

    const getRandomImageId = () => imageIds[Math.floor(Math.random() * imageIds.length)];

    // Get Rooms
    const rooms = await knex("rooms").select("id", "name");
    const room = rooms[0];

    // Get Events
    const events = await knex("events").select("id", "name");
    const event = events[0];

    // Get Vouchers
    const vouchers = await knex("vouchers").select("id", "name");
    const voucher = vouchers[0];

    const banners = [
        {
            title: "Objevte Ocean Room",
            subtitle: "Ponořte se do světa relaxace a klidu.",
            button_text: "Prozkoumat",
            image_id: getRandomImageId(),
            type: "room",
            room_id: room?.id,
            order: 1,
            is_active: true
        },
        {
            title: "Speciální Akce",
            subtitle: "Přijďte na naši nadcházející událost!",
            button_text: "Rezervovat",
            image_id: getRandomImageId(),
            type: "event",
            event_id: event?.id,
            order: 2,
            is_active: true
        },
        {
            title: "Dárkové Poukazy",
            subtitle: "Darujte radost svým blízkým.",
            button_text: "Koupit",
            image_id: getRandomImageId(),
            type: "voucher",
            voucher_id: voucher?.id,
            order: 3,
            is_active: true
        },
        {
            title: "Novinky v Sensory Fun",
            subtitle: "Sledujte nás na sociálních sítích.",
            button_text: "Více info",
            image_id: getRandomImageId(),
            type: "link",
            link: "https://example.com",
            order: 4,
            is_active: true
        }
    ];

    // Filter out banners where the related entity might be missing (e.g. if no rooms exist)
    const validBanners = banners.filter(b => {
        if (b.type === 'room' && !b.room_id) return false;
        if (b.type === 'event' && !b.event_id) return false;
        if (b.type === 'voucher' && !b.voucher_id) return false;
        return true;
    });

    await knex("banners").insert(validBanners);

    console.log(`Seeded ${validBanners.length} banners.`);
}
