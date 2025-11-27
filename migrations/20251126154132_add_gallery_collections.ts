import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Create gallery_collections table
    await knex.schema.createTable("gallery_collections", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.uuid("profile_image_id").nullable();
        table.timestamps(true, true);
    });

    // 2. Create gallery_images junction table (many-to-many: images can have multiple tags)
    await knex.schema.createTable("gallery_images", (table) => {
        table.uuid("gallery_id").references("id").inTable("gallery_collections").onDelete("CASCADE");
        table.uuid("image_id").references("id").inTable("images").onDelete("CASCADE");
        table.primary(["gallery_id", "image_id"]);
        table.timestamps(true, true);
    });

    // 3. Add foreign key for profile_image_id after images table exists
    await knex.schema.alterTable("gallery_collections", (table) => {
        table.foreign("profile_image_id").references("id").inTable("images").onDelete("SET NULL");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("gallery_images");
    await knex.schema.dropTableIfExists("gallery_collections");
}
