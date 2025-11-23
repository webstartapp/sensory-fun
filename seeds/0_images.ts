import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Helper to fetch image as base64 using native https
    async function fetchImageAsBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(buffer => Buffer.from(buffer).toString('base64'))
                .then(resolve)
                .catch(reject);
        });
    }

    // URLs matching the ones used in the app
    const imageUrls = [
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop", // 0: Hero 1 / Room 2 - Children playing
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070&auto=format&fit=crop", // 1: Hero 2 - Colorful playground
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop", // 2: Hero 3 / Room 1 / Voucher 3 - Kids activities
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop", // 3: Room 3
        "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop", // 4: Voucher 1
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop", // 5: Voucher 2
    ];

    console.log("Seeding images...");

    // Check if images already exist to avoid duplicates if run multiple times without clean
    // But user said "no deletions", so we should probably check or just insert. 
    // Usually seeds might clear data, but user said "no deletions or what so ever".
    // However, if we don't delete, we might duplicate images. 
    // I will check if the image data already exists or just insert blindly if that's the standard behavior expected.
    // Given "no deletions", I will assume append-only or idempotent if possible.
    // But base64 comparison is heavy. I'll just insert for now as requested.

    for (const url of imageUrls) {
        try {
            const base64 = await fetchImageAsBase64(url);
            // Optional: Check if exists? 
            // const exists = await knex("images").where({ data: base64 }).first();
            // if (!exists) {
            await knex("images").insert({ data: base64 });
            console.log(`Inserted image from ${url}`);
            // }
        } catch (error) {
            console.error(`Failed to fetch/insert image from ${url}:`, error);
        }
    }
}
