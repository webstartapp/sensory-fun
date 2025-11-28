import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("public_pages", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("slug").unique().notNullable();
        table.string("title").notNullable();
        table.text("content").notNullable();
        table.boolean("is_published").defaultTo(false);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("public_pages");
}
