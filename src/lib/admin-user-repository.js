import { Pool } from 'pg';

let pool;

function getPool() {
    if (pool) {
        return pool;
    }

    if (!process.env.DATABASE_URL) {
        return null;
    }

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    return pool;
}

export async function getAdminUserById(userId) {
    const db = getPool();

    if (!db) {
        return null;
    }

    const query = `
    SELECT
        id,
        full_name,
        role,
        branch_code
        FROM admin_users
        WHERE id = $1
        LIMIT 1
    `;

    const result = await db.query(query, [userId]);

    if (!result.rows.length) {
        return null;
    }

    const row = result.rows[0];

    return {
        id: row.id,
        fullName: row.full_name,
        role: row.role,
        branchCode: row.branch_code,
    };
}

export async function getCurrentAdminUser() {
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!adminUserId) {
        return null;
    }

    return getAdminUserById(adminUserId);
}
