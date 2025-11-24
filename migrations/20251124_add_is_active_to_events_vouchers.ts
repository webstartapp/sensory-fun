import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasEventsActive = await knex.schema.hasColumn("events", "is_active");
    if (!hasEventsActive) {
        await knex.schema.alterTable("events", (table) => {
            table.boolean("is_active").defaultTo(false);
        });
    }

    const hasVouchersActive = await knex.schema.hasColumn("vouchers", "is_active");
    if (!hasVouchersActive) {
        await knex.schema.alterTable("vouchers", (table) => {
            table.boolean("is_active").defaultTo(false);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasEventsActive = await knex.schema.hasColumn("events", "is_active");
    if (hasEventsActive) {
        await knex.schema.alterTable("events", (table) => {
            table.dropColumn("is_active");
        });
    }

    const hasVouchersActive = await knex.schema.hasColumn("vouchers", "is_active");
    if (hasVouchersActive) {
        await knex.schema.alterTable("vouchers", (table) => {
            table.dropColumn("is_active");
        });
    }
}
