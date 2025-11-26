import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Drop the existing status column (simplest way to handle enum change)
    await knex.schema.alterTable("bookings", (table) => {
        table.dropColumn("status");
    });

    // 2. Alter table to add new columns and modify existing ones
    await knex.schema.alterTable("bookings", (table) => {
        // Make event_id nullable
        table.uuid("event_id").nullable().alter();

        // Add voucher_id
        table.uuid("voucher_id").references("id").inTable("vouchers").onDelete("CASCADE").nullable();

        // Add booking_type
        table.enum("booking_type", ["event", "voucher"]).notNullable().defaultTo("event");

        // Add quantity
        table.integer("quantity").defaultTo(1);

        // Add voucher_code
        table.string("voucher_code").unique().nullable();

        // Add payment_id
        table.string("payment_id").nullable();

        // Re-add status with new values
        table.enum("status", [
            "pending_payment",
            "authorized",
            "confirmed",
            "declined",
            "cancelled"
        ]).defaultTo("pending_payment");
    });
}

export async function down(knex: Knex): Promise<void> {
    // Reverse changes
    await knex.schema.alterTable("bookings", (table) => {
        table.dropColumn("status");
    });

    await knex.schema.alterTable("bookings", (table) => {
        table.dropColumn("payment_id");
        table.dropColumn("voucher_code");
        table.dropColumn("quantity");
        table.dropColumn("booking_type");
        table.dropColumn("voucher_id");

        table.uuid("event_id").notNullable().alter();

        table.enum("status", ["processing", "accepted", "declined"]).defaultTo("processing");
    });
}
