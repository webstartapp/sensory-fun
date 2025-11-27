import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Create junction table for vouchers and rooms (many-to-many)
    await knex.schema.createTable("voucher_rooms", (table) => {
        table.uuid("voucher_id").references("id").inTable("vouchers").onDelete("CASCADE");
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE");
        table.primary(["voucher_id", "room_id"]);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("voucher_rooms");
}
