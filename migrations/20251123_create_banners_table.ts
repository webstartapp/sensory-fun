import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("banners", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("title", 50).notNullable();
        table.string("subtitle", 100).notNullable();
        table.string("button_text", 20).notNullable();
        table.uuid("image_id").references("id").inTable("images").onDelete("SET NULL");
        table.enum("type", ["room", "event", "voucher", "link"]).notNullable();
        table.string("link").nullable();
        table.uuid("room_id").references("id").inTable("rooms").onDelete("SET NULL").nullable();
        table.uuid("event_id").references("id").inTable("events").onDelete("SET NULL").nullable();
        table.uuid("voucher_id").references("id").inTable("vouchers").onDelete("SET NULL").nullable();
        table.integer("order").defaultTo(0);
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("banners");
}
