const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const sendEmail = async (senderId, receiverId, cc, subject, body) => {
    await pool.query(
        'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5)',
        [senderId, receiverId, cc, subject, body]
    );
};

const getInboxEmails = async (receiverId) => {
    const result = await pool.query(
        'SELECT * FROM emails WHERE receiver_id = $1 ORDER BY created_at DESC',
        [receiverId]
    );
    return result.rows;
};

const getSentEmails = async (senderId) => {
    const result = await pool.query(
        'SELECT * FROM emails WHERE sender_id = $1 ORDER BY created_at DESC',
        [senderId]
    );
    return result.rows;
};

const markEmailAsRead = async (emailId, receiverId) => {
    await pool.query('UPDATE emails SET is_read = TRUE WHERE id = $1 AND receiver_id = $2', [
        emailId,
        receiverId,
    ]);
};

module.exports = {
    sendEmail,
    getInboxEmails,
    getSentEmails,
    markEmailAsRead,
};