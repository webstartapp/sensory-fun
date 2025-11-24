import knex from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        ssl: false,
    },
};

const db = knex(config);

async function checkSchema() {
    try {
        console.log('Checking events table schema...');
        const columns = await db('events').columnInfo();
        console.log('Columns in events table:', Object.keys(columns));
    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await db.destroy();
    }
}

checkSchema();
