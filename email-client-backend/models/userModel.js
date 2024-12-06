const pool = require('../config/dbConfig');

const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    return result.rows[0];
};

const getUserById = async (id) => {
    const result = await pool.query('SELECT id, first_name, second_name, username, email, role FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
};

const createUser = async (firstName, secondName, username, email, passwordHash, role = 'user') => {
    const result = await pool.query(
        'INSERT INTO users (first_name, second_name, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [firstName, secondName, username, email, passwordHash, role]
    );
    const userId = result.rows[0].id;

    // Insert default folders for the new user
    await pool.query('INSERT INTO folders (user_id, name) VALUES ($1, $2), ($1, $3), ($1, $4)', [userId, 'Inbox', 'Sent', 'Recent Delete']);
};

const updateUser = async (id, firstName, secondName, username, email, role) => {
    await pool.query(
        'UPDATE users SET first_name = $1, second_name = $2, username = $3, email = $4, role = $5 WHERE id = $6 AND deleted_at IS NULL',
        [firstName, secondName, username, email, role, id]
    );
};

const updateUserPassword = async (id, passwordHash) => {
    await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2 AND deleted_at IS NULL',
        [passwordHash, id]
    );
};

const deleteUser = async (id) => {
    await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
    await pool.query('UPDATE emails SET is_user_deleted = TRUE WHERE sender_id = $1 OR receiver_id = $1', [id]);
};

module.exports = {
    getUserByEmail,
    createUser,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};