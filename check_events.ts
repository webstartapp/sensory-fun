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

async function checkEvents() {
    try {
        console.log('Connecting to database...');
        const events = await db('events')
            .leftJoin('images', 'events.image_id', 'images.id')
            .select('events.*', 'images.data as image')
            .where('events.is_active', true)
            .andWhere('events.is_public', true)
            .orderBy('events.start_date', 'asc');

        console.log('Events found:', events.length);
        if (events.length > 0) {
            console.log('First event:', {
                ...events[0],
                image: events[0].image ? 'Image data present' : 'No image data'
            });
        } else {
            console.log('No active public events found.');
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    } finally {
        await db.destroy();
    }
}

checkEvents();
