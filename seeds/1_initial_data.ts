import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // 1. Users
    // Check if admin exists
    const existingAdmin = await knex("users").where({ email: "admin@sensoryfun.cz" }).first();
    if (!existingAdmin) {
        await knex("users").insert([
            {
                email: "admin@sensoryfun.cz",
                password_hash: "hashed_password_placeholder", // In real app, use bcrypt
                first_name: "Admin",
                last_name: "User",
                role: "admin"
            }
        ]);
    }

    // Get all image IDs
    const images = await knex("images").select("id");
    const imageIds = images.map(img => img.id);

    if (imageIds.length === 0) {
        console.warn("No images found in DB. Skipping data seeding that requires images.");
        return;
    }

    const getRandomImageId = () => imageIds[Math.floor(Math.random() * imageIds.length)];

    // 3. Rooms
    // We use insert with onConflict or just insert. Since user said "no deletions", we risk duplicates if we run multiple times.
    // I'll use simple inserts as requested, assuming a fresh DB or manual cleanup if needed.

    const [room1] = await knex("rooms").insert([
        {
            name: "Ocean Room",
            location: "1. Patro, Místnost A",
            description: "Ponořte se do uklidňujícího podmořského světa.",
            capacity: 5,
            image_id: getRandomImageId()
        }
    ]).returning("id");

    const [room2] = await knex("rooms").insert([
        {
            name: "Forest Adventure",
            location: "1. Patro, Místnost B",
            description: "Objevte kouzlo lesa a přírody.",
            capacity: 8,
            image_id: getRandomImageId()
        }
    ]).returning("id");

    const [room3] = await knex("rooms").insert([
        {
            name: "Cosmic Space",
            location: "2. Patro, Místnost C",
            description: "Cesta do vesmíru pro malé astronauty.",
            capacity: 6,
            image_id: getRandomImageId()
        }
    ]).returning("id");

    // 4. Vouchers
    await knex("vouchers").insert([
        {
            name: "Základní Zážitek",
            description: "Vstup pro 1 osobu na 60 minut do libovolné místnosti.",
            price: 500,
            validity_days: 90,
            image_id: getRandomImageId()
        },
        {
            name: "Rodinný Balíček",
            description: "Vstup pro celou rodinu (2+2) na 90 minut.",
            price: 1200,
            validity_days: 120,
            image_id: getRandomImageId()
        },
        {
            name: "Relaxace v Ocean Room",
            description: "Speciální balíček pro relaxaci v naší nejoblíbenější místnosti.",
            price: 600,
            validity_days: 60,
            image_id: getRandomImageId(),
        }
    ]);

    // 5. Events
    await knex("events").insert([
        {
            room_id: room1.id,
            name: "Sensory Yoga for Kids",
            description: "Speciální lekce jógy zaměřená na smyslový rozvoj dětí.",
            price: 250,
            duration_minutes: 60,
            type: "single",
            start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            is_public: true,
            image_id: getRandomImageId()
        }
    ]);

    console.log("Initial data seeding complete!");
}
