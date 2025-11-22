import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("booking_attendees").del();
    await knex("transactions").del();
    await knex("bookings").del();
    await knex("events_traces").del();
    await knex("rooms_traces").del();
    await knex("vouchers").del();
    await knex("events").del();
    await knex("traces").del();
    await knex("rooms").del();
    await knex("images").del();
    await knex("users").del();

    // 1. Users
    const [adminUser] = await knex("users").insert([
        {
            email: "admin@sensoryfun.cz",
            password_hash: "hashed_password_placeholder", // In real app, use bcrypt
            first_name: "Admin",
            last_name: "User",
            role: "admin"
        }
    ]).returning("id");

    // 2. Images (Placeholders)
    const [roomImage] = await knex("images").insert([
        { data: "base64_image_data_placeholder" }
    ]).returning("id");

    // 3. Rooms
    const [room1] = await knex("rooms").insert([
        {
            name: "Sensory Room A",
            location: "Prague 1",
            description: "A calming space with light therapy.",
            capacity: 10,
            primary_image_id: roomImage.id
        }
    ]).returning("id");

    // Update image with room_id
    await knex("images").where({ id: roomImage.id }).update({ room_id: room1.id });

    // 4. Traces
    const [trace1] = await knex("traces").insert([
        {
            name: "Light Therapy",
            description: "Soothing light sequences."
        }
    ]).returning("id");

    await knex("rooms_traces").insert([
        { room_id: room1.id, trace_id: trace1.id }
    ]);

    // 5. Events
    await knex("events").insert([
        {
            room_id: room1.id,
            name: "Morning Relaxation",
            description: "Start your day with peace.",
            price: 200,
            duration_minutes: 60,
            type: "single",
            start_date: new Date().toISOString(),
            is_public: true
        }
    ]);
}
