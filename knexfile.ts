import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./seeds",
            extension: "ts",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./seeds",
            extension: "ts",
        },
    },
};

export default config;
