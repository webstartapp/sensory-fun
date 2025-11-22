import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Users
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("email").unique().notNullable();
        table.string("password_hash").notNullable();
        table.string("first_name");
        table.string("last_name");
        table.enum("role", ["admin", "customer"]).defaultTo("customer");
        table.timestamps(true, true);
    });

    // 2. Images (Created early for FK references)
    await knex.schema.createTable("images", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.text("data").notNullable(); // Base64
        // FKs will be added after other tables are created to avoid circular dependency issues during creation if strictly ordered, 
        // but here we can add columns now and constraints later or just order carefully.
        // Since rooms/events need primary_image_id, and images need room_id/event_id, we have a circular dependency.
        // Strategy: Create tables first, then add FK constraints.
        table.uuid("room_id").nullable();
        table.uuid("event_id").nullable();
        table.uuid("trace_id").nullable();
        table.uuid("voucher_id").nullable();
        table.timestamps(true, true);
    });

    // 3. Rooms
    await knex.schema.createTable("rooms", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.string("location");
        table.text("description");
        table.integer("capacity").nullable(); // null = infinite
        table.integer("order").defaultTo(0);
        table.uuid("primary_image_id").nullable(); // FK added later
        table.boolean("is_active").defaultTo(true);
        table.boolean("is_public").defaultTo(true);
        table.timestamps(true, true);
    });

    // 4. Traces
    await knex.schema.createTable("traces", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.text("description");
        table.uuid("primary_image_id").nullable(); // FK added later
        table.timestamps(true, true);
    });

    // 5. Rooms <-> Traces (Many-to-Many)
    await knex.schema.createTable("rooms_traces", (table) => {
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE");
        table.uuid("trace_id").references("id").inTable("traces").onDelete("CASCADE");
        table.primary(["room_id", "trace_id"]);
    });

    // 6. Events
    await knex.schema.createTable("events", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").notNullable();
        table.string("name").notNullable();
        table.text("description");
        table.integer("price").defaultTo(0); // CZK
        table.integer("duration_minutes");
        table.integer("order").defaultTo(0);
        table.uuid("primary_image_id").nullable(); // FK added later
        table.boolean("is_public").defaultTo(true);
        table.boolean("is_featured").defaultTo(false);
        table.enum("type", ["single", "repeating", "campaign"]).notNullable();

        // Type specific
        table.timestamp("start_date").nullable();
        table.timestamp("end_date").nullable();
        table.jsonb("repeat_days").nullable();
        table.time("repeat_time").nullable();

        table.timestamps(true, true);
    });

    // 7. Events <-> Traces (Many-to-Many)
    await knex.schema.createTable("events_traces", (table) => {
        table.uuid("event_id").references("id").inTable("events").onDelete("CASCADE");
        table.uuid("trace_id").references("id").inTable("traces").onDelete("CASCADE");
        table.primary(["event_id", "trace_id"]);
    });

    // 8. Vouchers
    await knex.schema.createTable("vouchers", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("code").unique().notNullable();
        table.enum("status", ["active", "used", "expired"]).defaultTo("active");
        table.integer("price").defaultTo(0);
        table.timestamp("valid_until");
        table.uuid("primary_image_id").nullable(); // FK added later
        table.uuid("purchased_by_user_id").references("id").inTable("users").onDelete("SET NULL").nullable();
        table.timestamps(true, true);
    });

    // 9. Bookings
    await knex.schema.createTable("bookings", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("user_id").references("id").inTable("users").onDelete("SET NULL").nullable();
        table.uuid("event_id").references("id").inTable("events").onDelete("CASCADE").notNullable();
        table.enum("status", ["processing", "accepted", "declined"]).defaultTo("processing");
        table.integer("seats").defaultTo(0);
        table.integer("total_price").defaultTo(0);
        table.timestamp("booking_time"); // For repeating events

        // Guest details
        table.string("customer_name").notNullable();
        table.string("customer_email").notNullable();
        table.string("customer_phone");

        table.timestamps(true, true);
    });

    // 10. Booking Attendees
    await knex.schema.createTable("booking_attendees", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("booking_id").references("id").inTable("bookings").onDelete("CASCADE").notNullable();
        table.string("name");
        table.integer("age");
    });

    // 11. Transactions
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("booking_id").references("id").inTable("bookings").onDelete("CASCADE").notNullable();
        table.enum("gateway", ["paypal", "global_payments"]).notNullable();
        table.string("transaction_id");
        table.integer("amount");
        table.string("currency").defaultTo("CZK");
        table.string("status");
        table.jsonb("response_data");
        table.timestamps(true, true);
    });

    // Add Circular Foreign Keys
    await knex.schema.alterTable("images", (table) => {
        table.foreign("room_id").references("id").inTable("rooms").onDelete("CASCADE");
        table.foreign("event_id").references("id").inTable("events").onDelete("CASCADE");
        table.foreign("trace_id").references("id").inTable("traces").onDelete("CASCADE");
        table.foreign("voucher_id").references("id").inTable("vouchers").onDelete("CASCADE");
    });

    await knex.schema.alterTable("rooms", (table) => {
        table.foreign("primary_image_id").references("id").inTable("images").onDelete("SET NULL");
    });

    await knex.schema.alterTable("traces", (table) => {
        table.foreign("primary_image_id").references("id").inTable("images").onDelete("SET NULL");
    });

    await knex.schema.alterTable("events", (table) => {
        table.foreign("primary_image_id").references("id").inTable("images").onDelete("SET NULL");
    });

    await knex.schema.alterTable("vouchers", (table) => {
        table.foreign("primary_image_id").references("id").inTable("images").onDelete("SET NULL");
    });
}

export async function down(knex: Knex): Promise<void> {
    // Drop in reverse order of dependency

    // Remove circular FKs first
    await knex.schema.alterTable("vouchers", (table) => {
        table.dropForeign("primary_image_id");
    });
    await knex.schema.alterTable("events", (table) => {
        table.dropForeign("primary_image_id");
    });
    await knex.schema.alterTable("traces", (table) => {
        table.dropForeign("primary_image_id");
    });
    await knex.schema.alterTable("rooms", (table) => {
        table.dropForeign("primary_image_id");
    });
    await knex.schema.alterTable("images", (table) => {
        table.dropForeign("room_id");
        table.dropForeign("event_id");
        table.dropForeign("trace_id");
        table.dropForeign("voucher_id");
    });

    await knex.schema.dropTableIfExists("transactions");
    await knex.schema.dropTableIfExists("booking_attendees");
    await knex.schema.dropTableIfExists("bookings");
    await knex.schema.dropTableIfExists("vouchers");
    await knex.schema.dropTableIfExists("events_traces");
    await knex.schema.dropTableIfExists("events");
    await knex.schema.dropTableIfExists("rooms_traces");
    await knex.schema.dropTableIfExists("traces");
    await knex.schema.dropTableIfExists("rooms");
    await knex.schema.dropTableIfExists("images");
    await knex.schema.dropTableIfExists("users");
}
